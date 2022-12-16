import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.mjs',
        banner: '#!/usr/bin/env node',
    },
    plugins: [
        nodeResolve(), // imports from node_modules
        commonjs(), // converts cjs modules to es6
        terser() // minfiy
    ]
};