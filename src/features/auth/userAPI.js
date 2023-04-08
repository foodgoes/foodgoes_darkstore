export async function fetchUser() {
    try {
        const response = await fetch('/api/front/user', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        })
        return await response.json();
    } catch(e) {
        return null;
    }
}