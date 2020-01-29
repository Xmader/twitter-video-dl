#!/usr/bin/env node
// @ts-check

const { downloadVideo } = require("../dist/main")
const fs = require("fs")
const { join } = require("path")
const yargs = require("yargs")

// @ts-ignore
const { name, description } = require("../package.json")

const usage = `${name}: \n${description}\n\nUsage: $0 [-o <output_dir>] -t <tweet id or URL>\n`
const example = "Example: $0 -o ./videos/ -t https://twitter.com/4freedom1984/status/1221784446728192005"
const epilogue = "This project is open source on Github: https://github.com/Xmader/twitter-video-dl"

const argv = yargs.scriptName(name).usage(usage + example).epilogue(epilogue).options({
    "t": {
        alias: ["tweet"],
        describe: "The tweet id or the URL to the tweet",
        type: "string",
        demandOption: true,
    },
    "o": {
        alias: ["out-dir"],
        describe: "The directory that the downloaded video will be saved into",
        type: "string",
        default: "./",
        normalize: true,
    },
}).version().help().wrap(yargs.terminalWidth()).argv

downloadVideo(argv.t).then(({ id, data }) => {
    const file = join(argv.o || "./", `${id}.m2ts`)
    fs.writeFileSync(file, data)
})
