import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        root: "src",
        publicDir: "../public",
        build: {
            outDir: "../dist",
            emptyOutDir: true
        },
        plugins: [vue()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url))
            },
            extensions: [".js", ".ts", ".json", ".vue"]
        },
        define: {
            "import.meta.env.VITE_SERVICE_ID": JSON.stringify(env.VITE_SERVICE_ID || ""),
            "import.meta.env.VITE_TEMPLATE_ID": JSON.stringify(env.VITE_TEMPLATE_ID || ""),
            "import.meta.env.VITE_USER_ID": JSON.stringify(env.VITE_USER_ID || "")
        }
    };
});
