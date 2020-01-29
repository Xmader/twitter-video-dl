
import { fetch } from "./utils/shim"
import { getVideoInfo } from "./video-info"

const baseURL = "https://video.twimg.com"

export const parseM3U8 = async (
    m3u8Url: string,
) => {
    const r = await fetch(m3u8Url)
    const data = await r.text()

    const videoUrls: string[] = data.match(/^(\/ext_tw_video\/.*)$/gm)
    return videoUrls
}

export const getVideoPartUrls = async (
    tweetId: string,
): Promise<string[]> => {
    const info = await getVideoInfo(tweetId)
    const m3u8Url = info.track.playbackUrl

    const resolutionChoiceUrls = await parseM3U8(m3u8Url)
    const videoM3U8Url = baseURL + resolutionChoiceUrls.slice(-1)[0]  // choose the url of the highest resolution for the video

    const videoPartUrls = await parseM3U8(videoM3U8Url)

    return videoPartUrls.map((url) => {
        return baseURL + url
    })
}
