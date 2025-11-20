// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     // host: "31.97.98.240",
//     host: "0.0.0.0",
//     // port: 4174,
//   },
//   build: {
//     sourcemap: false, // disables source maps for production
//     minify: "esbuild", // faster minifier
//   },
// });




// vite.config.js
import { defineConfig } from 'vite'
 
export default defineConfig({
  server: {
    host: true,        // listen on 0.0.0.0 so nginx can reach it
    port: 3001
  },
  // optionally also allow preview host if you sometimes run `vite preview`
  preview: {
    allowedHosts: ['dashboard.lunq.fr', 'www.dashboard.lunq.fr']
  }
})