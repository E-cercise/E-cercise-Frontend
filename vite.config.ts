import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env': env
        },
        plugins: [react(), svgr()],
    }
})
