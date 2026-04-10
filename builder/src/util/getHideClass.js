export default function getHideClass(hideOn) {
    if (!hideOn) return '';
    const obj = {
        mobile: 'hidden-sm',
        tablet: 'hidden-md',
        desktop: 'hidden-lg',
    };

    return hideOn
        .split('+')
        .map((item) => obj[item])
        .join(' ');
}
