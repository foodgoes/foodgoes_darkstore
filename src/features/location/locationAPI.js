export async function fetchLocation() {
    try {
        const response = await fetch('/api/front/location', {
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