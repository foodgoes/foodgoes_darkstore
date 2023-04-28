export function getPrice(x) {
    return +Number.parseFloat(x).toFixed(2);
}

export function getPriceFormat(x) {
    return Number.parseFloat(x).toFixed(2).replace('.00', '');
}