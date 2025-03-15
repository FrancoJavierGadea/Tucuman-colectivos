
import AstroPWA from '@vite-pwa/astro'

const MANIFEST = {
    name: "Tucumapp",
    short_name: "Tucumapp",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d6efd",
    icons: [
		{ "src": "icons/48x48.webp", "sizes": "48x48", "type": "image/webp" },
		{ "src": "icons/72x72.webp", "sizes": "72x72", "type": "image/webp" },
		{ "src": "icons/96x96.webp", "sizes": "96x96", "type": "image/webp" },
		{ "src": "icons/128x128.webp", "sizes": "128x128", "type": "image/webp" },
		{ "src": "icons/144x144.webp", "sizes": "144x144", "type": "image/webp" },
		{ "src": "icons/152x152.webp", "sizes": "152x152", "type": "image/webp" },
		{ "src": "icons/192x192.webp", "sizes": "192x192", "type": "image/webp" },
		{ "src": "icons/512x512.webp", "sizes": "512x512", "type": "image/webp" }
    ]
}


export default AstroPWA({

    registerType: 'autoUpdate',

    manifest: MANIFEST,

    strategies: 'injectManifest',
    srcDir: 'src/workers/',
    filename: 'sw.js',

    injectManifest: {
        globPatterns: ['**/*.{js,css,html,webp,svg,json,geojson}'],
		globDirectory: 'dist'
    },

    devOptions: {
      	enabled: true,
      	type: 'module',
    }
});