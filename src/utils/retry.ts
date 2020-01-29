
export const retry = async <F extends (...args: any) => any>(fn: F, ...args: Parameters<F>): Promise<ReturnType<F>> => {
    try {
        const a: Array<any> = args
        return await fn(...a)
    } catch (e) {
        console.error(e)
        return await retry(fn, ...args)
    }
}
