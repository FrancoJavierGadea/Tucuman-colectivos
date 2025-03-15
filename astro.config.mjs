// @ts-check
import { defineConfig } from 'astro/config';
import PWA_CONFIG from './pwa.config.js';

// https://astro.build/config
export default defineConfig({

    integrations: [
        PWA_CONFIG
    ],

    devToolbar: {
        enabled: false
    }
});
