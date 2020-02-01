
import { downloadVideo, parseTweetIdOrUrl } from "../main"

import CloudflareWorkerGlobalScope from "types-cloudflare-worker"
declare const self: CloudflareWorkerGlobalScope

const handleRequest = async (request: Request) => {
    const reqPath = new URL(request.url).pathname

    if (reqPath == "/") {
        return Response.redirect("https://github.com/Xmader/twitter-video-dl", 307)
    } else if (reqPath == "/favicon.ico") {
        return Response.redirect("https://abs.twimg.com/favicons/twitter.ico", 307)
    }

    const tweetIdOrUrl = reqPath.slice(1)

    // catch parse error
    try {
        parseTweetIdOrUrl(tweetIdOrUrl)
    } catch {
        return new Response("Can't parse tweet id.", {
            status: 400,
        })
    }

    try {
        const { id, data } = await downloadVideo(tweetIdOrUrl)

        return new Response(data, {
            headers: {
                "content-type": "video/MP2T",
                "content-disposition": `attachment; filename="${id}.ts"`
            },
            status: 200,
        })
    } catch (e) {
        return new Response((e as Error).message, {
            status: 500
        })
    }
}

self.addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})
