export async function fetchDiscounts() {
    try {
        const response = await fetch('/api/front/discounts', {
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

export async function computeDiscountAPI() {
    const response = await fetch('/api/front/compute-discount', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
  };