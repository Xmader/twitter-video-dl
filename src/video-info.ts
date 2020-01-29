
import { fetch } from "./utils/shim"
import { retry } from "./utils/retry"
import { Tokens, getTokens } from "./tokens"

export interface VideoInfo {
    track: {
        contentType: "media_entity",
        publisherId: string,
        contentId: string,
        durationMs: number,
        playbackUrl: string,
        playbackType: "application/x-mpegURL",
        expandedUrl: string,
        vmapUrl?: string,
        cta?: any,
        shouldLoop?: boolean,
        viewCount?: string,
        isEventGeoblocked?: bigint,
        is360?: boolean,
        mediaAvailability?: { status: "available", reason: null }
    },
    posterImage: string,
    features?: {
        [feature: string]: any;
    },
    translations?: {
        [item: string]: string
    }
}

type P<T> = T | Promise<T> | Promise<Promise<T>>

export const getVideoInfo = async (
    /** tweet id */ id: string,
    tokens: P<Tokens> = retry(getTokens),
): Promise<VideoInfo> => {
    const url = `https://api.twitter.com/1.1/videos/tweet/config/${id}.json`

    tokens = await tokens
    // console.log(tokens)

    const r = await fetch(url, {
        headers: {
            "Accept": "application/json",
            "authorization": tokens.auth,
            "x-csrf-token": tokens.ct0,
            "x-guest-token": tokens.gt
        }
    })

    const json = await r.json()
    return json
}
