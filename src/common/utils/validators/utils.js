export function setOutputOption(v=[], msg='') {
    const res = Array.isArray(v) ? [v[0], v[1] ? v[1] : msg] : [v, msg];

    res[1] = res[1].replace('#value#', res[0]);

    return res;
}
