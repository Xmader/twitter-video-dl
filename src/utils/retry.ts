
export const retry = async <F extends (...args: any) => any>(fn: F, n: number = 3, ...args: Parameters<F>): Promise<ReturnType<F>> => {
    try {
        const a: Array<any> = args
        return await fn(...a)
    } catch (e) {
        if (n - 1 <= 0) {
            throw e
        }
        return await retry(fn, n - 1, ...args)
    }
}
