import {defineConfig} from 'vite';
export default defineConfig({build:{rollupOptions:{input:{settlement:'index.html',legacy:'legacy.html',inspection:'environment-review.html'}}}});
