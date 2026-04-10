export const dateFormat = [
    { value: 'd MMMM Y', name: 'Default' },
    { value: 'd MM Y', name: '01 02 2022' },
    { value: 'E MMMM Y', name: 'Mon January 2022' },
    { value: 'd MM Y HH:mm', name: '01 02 2022 06:00' },
    { value: 'E MM Y HH:mm', name: 'Mon 01 2022 12:00' },
    { value: 'd MMMM Y HH:mm', name: '01 January 2022 06:02' },
    { value: 'd MM Y HH:mm a', name: '01 02 2022 06:00 AM' },
    { value: 'd MMMM Y HH:mm a', name: '01 January 2022 06:02 AM' },
    { value: 'EEEE MM Y HH:mm a', name: 'Monday 01 2022 12:00 AM' },
];
export const dateFormats = {
    label: 'Date Format',
    template: 'Select',
    options: dateFormat,
};
