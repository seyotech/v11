export default function dateFormat(date, format) {
    if (!date) {
        console.warn('Invalid date', date);
        return;
    }
    var options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}
