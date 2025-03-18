// @ts-check
import { defineConfig } from 'astro/config';
import PWA_CONFIG from './pwa.config.js';
import path from "node:path";

// https://astro.build/config
export default defineConfig({

    integrations: [
        PWA_CONFIG
    ],

    vite: {
        resolve: {
            alias: {
                '@': path.join(import.meta.dirname, 'src')
            }
        }
    },

    devToolbar: {
        enabled: false
    }
});
