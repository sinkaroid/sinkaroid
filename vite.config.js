import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url))
            },
            extensions: [".js", ".ts", ".json", ".vue"]
        },
        define: {
            "process.env.serviceID": JSON.stringify(env.serviceID || "service_xxx"),
            "process.env.templateID": JSON.stringify(env.templateID || "template_xxx"),
            "process.env.userID": JSON.stringify(env.userID || "user_xxx"),
            "process.env": {}
        }
    };
});
