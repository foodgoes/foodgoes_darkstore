export function financial(x) {
    return +Number.parseFloat(x).toFixed(1);
}

export function financialStr(x) {
    return Number.parseFloat(x).toFixed(2).replace('.00', '');
}