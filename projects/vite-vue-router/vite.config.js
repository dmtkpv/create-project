import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default {

    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },

    server: {
        port: 49003
    },

    plugins: [
        vue()
    ]
}