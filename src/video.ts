
import { fetch } from "./utils/shim"
import { getVideoPartUrls } from "./m3u8"

const _downloadVideo = async (
    tweetId: string,
): Promise<Uint8Array> => {
    const urls = await getVideoPartUrls(tweetId)

    const parts = await Promise.all(
        urls.map(async (u) => {
            const r = await fetch(u)
            const buf = await r.arrayBuffer()
            return new Uint8Array(buf)
        })
    )

    const totalBytes = parts.reduce((p, c) => p + c.byteLength, 0)

    const result = new Uint8Array(totalBytes)
    parts.reduce((offset, buf) => {
        result.set(buf, offset)
        return offset + buf.byteLength
    }, 0)

    return result
}

/**
 * @returns tweet id
 */
export const parseTweetIdOrUrl = (tweetIdOrUrl: string): string => {
    const isId = tweetIdOrUrl.match(/^\d+$/)
    if (isId) {
        return tweetIdOrUrl
    }

    return tweetIdOrUrl.match(/twitter.com\/(?:.*?)\/status\/(\d+)/)[1]
}

export const downloadVideo = async (
    tweetIdOrUrl: string,
) => {
    const id = parseTweetIdOrUrl(tweetIdOrUrl)
    const videoData = await _downloadVideo(id)
    return {
        id,
        data: videoData,  // in .ts format
    }
}
