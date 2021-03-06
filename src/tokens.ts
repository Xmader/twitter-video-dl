
import { fetch } from "./utils/shim"

export interface Tokens {
    auth: string;  // Bearer
    ct0: string;   // x-csrf-token
    gt: string;    // x-guest-token
}

const AUTH = "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"

const getCsrfToken = async () => {
    let cookies: string

    if (typeof window !== "undefined" && window.document) {
        cookies = window.document.cookie
    } else {
        const r = await fetch("https://twitter.com/", {
            "headers": {
                "User-Agent": "Mozilla/5.0",
            },
        })
        cookies = r.headers.get("set-cookie")
    }

    const ct0 = cookies.match(/ct0=(.+?);/)[1]
    return ct0
}

const gtReg = /gt=(.+?);/

const getGuestToken = async () => {
    if (typeof window !== "undefined" && window.document) {
        const cookies = window.document.cookie
        const gt = cookies.match(gtReg)[1]
        return gt
    } else {
        const r = await fetch("https://twitter.com/", {
            "headers": {
                "User-Agent": "Mozilla/5.0 (Linux; x64; rv:72.0) Gecko/20100101 Firefox/72.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            },
        })
        const html = await r.text()
        const gt = html.match(gtReg)[1]
        return gt
    }
}

export const getTokens = async (): Promise<Tokens> => {
    const [
        ct0,
        gt
    ] = await Promise.all([
        getCsrfToken(),
        getGuestToken()
    ])

    return {
        auth: AUTH,
        ct0,
        gt,
    }
}
