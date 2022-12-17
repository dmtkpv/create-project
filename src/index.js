import { readFileSync, existsSync, cpSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { exec } from 'node:child_process'
import prompts from 'prompts'



// ---------------------
// Helpers
// ---------------------

const projectsDir = resolve(fileURLToPath(import.meta.url), '../../projects');

function getPackageJson (directory) {
    return JSON.parse(readFileSync(resolve(directory, 'package.json')));
}

function setPackageJson (directory, packageJson) {
    writeFileSync(resolve(directory, 'package.json'), JSON.stringify(packageJson, null, 4))
}

function getModuleVersion (module) {
    return promisify(exec)(`npm show ${module} version`).then(data => data.stdout)
}

async function updateDeps (modules = {}) {
    for (const module in modules) {
        if (!modules.hasOwnProperty(module)) continue;
        if (modules[module] !== '*') continue;
        const version = await getModuleVersion(module);
        modules[module] = '^' + version.trim();
    }
}




// ---------------------
// Questions
// ---------------------

const questions = [
    {
        type: 'text',
        name: 'directory',
        message: 'Project name:',
        initial: 'project',
        format: value => value.trim(),
    },
    {
        type: directory => existsSync(directory) && 'confirm',
        name: 'overwrite',
        message: 'Project already exists. Overwrite?',
        onState ({ value }) {
            if (value === false) throw new Error('Operation cancelled')
        }
    },
    {
        type: 'select',
        name: 'project',
        message: 'Select a template:',
        initial: 0,
        choices: readdirSync(projectsDir).map(title => ({ title, value: resolve(projectsDir, title) })),

    }
]



// ---------------------
// Apply template
// ---------------------

async function init () {

    const { directory, project } = await prompts(questions);

    console.log(`Scaffolding project in ${directory}...`)
    cpSync(project, directory, { recursive: true, force: true });

    const packageJson = getPackageJson(directory);
    await updateDeps(packageJson.dependencies);
    await updateDeps(packageJson.devDependencies);
    await updateDeps(packageJson.peerDependencies);
    setPackageJson(directory, packageJson);

    console.log(`Done. Now run:`)
    console.log(`  cd ${directory}`)
    console.log(`  npm install`)

}



// ---------------------
// Init
// ---------------------

init().catch(error => {
    console.error(error);
})

