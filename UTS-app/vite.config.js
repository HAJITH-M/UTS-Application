import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { config } from 'dotenv';
config();


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  esbuild: {
    loader: 'jsx', // Ensures .js files can have JSX
    include: /src\/.*\.js$/, // Include only .js files in the src folder
  },
})
