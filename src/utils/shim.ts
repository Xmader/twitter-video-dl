/**
 * shim for browser and Node.js
 */

// @ts-ignore
const _fetch: typeof import("node-fetch").default = typeof fetch !== "undefined" ? fetch : require("node-fetch").default

export { _fetch as fetch }
