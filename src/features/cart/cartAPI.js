export async function fetchCart() {
    try {
        const response = await fetch('/api/front/cart', {
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