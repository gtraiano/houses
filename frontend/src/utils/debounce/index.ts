export const debounce = (cb: Function, delay = 250) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => { cb(...args) }, delay)
    }
}
