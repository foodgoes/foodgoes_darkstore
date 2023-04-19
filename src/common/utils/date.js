export function getFullDate (date) {
    const d = new Date(date);

    let _day = null;
    let day = _day = d.getDate();
    if (day < 10) _day = '0' + day;

    let _month = null;
    let month = _month = d.getMonth() + 1;
    if (month < 10) _month = '0' + month;

    let _year = null;
    let year = _year = d.getFullYear() % 100;
    if (year < 10) _year = '0' + year;

    let _hours = null;
    let hours = _hours = d.getHours();
    if (hours < 10) _hours = '0' + hours;

    let _minuts = null;
    let minuts = _minuts = d.getMinutes();
    if (minuts < 10) _minuts = '0' + minuts;

    return {
        day: _day,
        month: _month,
        year: _year,
        hours: _hours,
        minuts: _minuts
    };
}

export function getDateV2 (date) {
    const d = new Date(date);
    const monthCode = getMonthCode(d.getMonth());

    let _day = null;
    let day = _day = d.getDate();
    if (day < 10) _day = '0' + day;

    let _hours = null;
    let hours = _hours = d.getHours();
    if (hours < 10) _hours = '0' + hours;

    let _minuts = null;
    let minuts = _minuts = d.getMinutes();
    if (minuts < 10) _minuts = '0' + minuts;

    return {monthCode, day: _day, hours: _hours, minuts: _minuts};
}

function getMonthCode(monthInt) {
    const months = [
        'january', 'february',
        'march', 'april', 'may',
        'june', 'july', 'august',
        'september', 'october', 'november',
        'december'
    ];

    return months[monthInt];
}