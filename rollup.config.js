import typescript from "rollup-plugin-typescript"

const plugins = [
    typescript({
        sourceMap: false,
    }),
    {
        /**
         * remove tslib license comments
         * @param {string} code 
         * @param {string} id 
         */
        transform(code, id) {
            if (id.includes("tslib")) {
                code = code.split(/\r?\n/g).slice(15).join("\n")
            }
            return {
                code
            }
        }
    },
]

export default {
    input: "src/cloudflare-worker/entry.ts",
    output: {
        file: "dist/cloudflare-worker.js",
        format: "iife",
        sourcemap: false,
    },
    plugins,
}