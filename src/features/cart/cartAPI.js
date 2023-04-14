export async function fetchCart() {
    try {
        const response = await fetch('/api/front/cart', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return await response.json();
    } catch(e) {
        return null;
    }
}

export async function updateCart(body) {
    try {
        const response = await fetch('/api/front/cart', {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        return await response.json();
    } catch(e) {
        return null;
    }
};