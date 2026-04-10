export default function gradient(prop, itrator) {
    const gradient = new Map(itrator);

    const radialDirection = gradient.get('radialDirection');
    const [startColor, startPos] = gradient.get('start');
    const [endColor, endPos] = gradient.get('end');
    const direction = gradient.get('direction');
    const shape = gradient.get('shape');
    const type = gradient.get('type');
    let gradientDir = direction;

    if (type === 'radial') {
        gradientDir = `${shape} at ${radialDirection}`;
    }

    let cssString = `  background-image: `;
    cssString += type === 'linear' ? 'linear-gradient(' : 'radial-gradient(';
    cssString += `${gradientDir}, ${startColor} ${startPos}, ${endColor} ${endPos}`;
    cssString += ');';
    return cssString;
}
