import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), '');

  const mergedEnv = {
    ...process.env,
    ...fileEnv,
  };

  return {
    define: {
      // This way, in your code, `process.env.API_BASE_URL` will be replaced
      // by the actual string from mergedEnv.API_BASE_URL at build time.
      'process.env': JSON.stringify(mergedEnv),
    },
    plugins: [react(), svgr()],
      base: '/',
  };
});
