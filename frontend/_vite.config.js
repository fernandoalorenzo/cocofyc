import { defineConfig } from "vite";

export default defineConfig({
	build: {
		chunkSizeWarningLimit: 3000, // Tamaño máximo de los chunks en KB
	},
});
