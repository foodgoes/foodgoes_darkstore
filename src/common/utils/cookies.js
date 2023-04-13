export function addCookie(key, value, seconds) {
    try {
        const d = new Date();
        d.setTime(d.getTime() + (seconds*1000));
        const expires = "expires="+ d.toUTCString();
        document.cookie = `${key}=${value}; ${expires}; path=/`;
    } catch(e) {
        return false;
    }
}