import kebabCase from '../kebabCase';
const keys = Object.keys;

const defaultValues = {
    textShadow: {
        x: '0px',
        y: '0px',
        blur: '0px',
        color: '#000000',
    },
    boxShadow: {
        x: '0px',
        y: '0px',
        blur: '0px',
        spread: '0px',
        color: '#000000',
        type: '',
    },
};

const buildStyle = {
    compoundProps: {
        border: 'leadingProps',
        margin: 'leadingProps',
        padding: 'leadingProps',

        filter: 'functionKeyed',
        transform: 'functionKeyed',

        textDecoration: 'inlineValues',
        textShadow: 'inlineValues',
    },

    /**
     * @param {string} prop camelCased CSS property name
     * @param {*} value the value should be processed
     * @returns {string} CSS declarations
     */
    css(prop, value) {
        if (value === '' || value === undefined || value === null) return '';

        if (this.hasOwnProperty(prop)) {
            return this[prop](value);
        } else if (keys(this.compoundProps).includes(prop)) {
            const compoundMethod = this[this.compoundProps[prop]].bind(this);
            return compoundMethod(prop, value);
        } else {
            return this.simpleStyle(prop, value);
        }
    },

    /**
     * @param {string} prop camelCased CSS property name
     * @param {string} value a single line string value
     * @returns {string} CSS declaration
     */
    simpleStyle(prop, value) {
        return `  ${kebabCase(prop)}: ${value}; \n`;
    },

    /**
     * @param {string} parentProp base property to be prefixed
     * @param {Array<array>} arr iterable values
     * @returns {string} CSS declarations
     */
    mapToCss(parentProp, arr) {
        return arr
            .map(([prop, value]) => `  ${parentProp}-${prop}: ${value};`)
            .join('\n');
    },

    /**
     * @param {string} prop base property name
     * @param {array<array>} value iterable values
     * @returns {string} CSS declarations
     */
    leadingProps(prop, value) {
        return this.mapToCss(kebabCase(prop), value) + '\n';
    },

    /**
     * @param {array} value an iterable values
     * @returns {string} CSS declaration
     */
    functionKeyed(prop, value) {
        value = Object.entries(value);
        const result = value
            .map(([key, value]) => value && `${key}(${value})`)
            .join(' ')
            .trim();

        return result && `  ${kebabCase(prop)}: ${result};\n`;
    },

    /**
     * This method returns simple inline values of a complex input
     * ex: `text-shadow: 4px 5px 10px #000;
     *
     * @param {string} prop CSS property name, camelCased
     * @param {object} value An object of values to be prepared as CSS string
     * @returns {string} CSS declaration
     */
    inlineValues(prop, value) {
        const mergedValues = { ...defaultValues[prop], ...value };
        const values = Object.entries(mergedValues)
            .filter(([key]) => key.charAt(0) !== '_')
            .map(([_, value]) => value)
            .join(' ');
        return `${kebabCase(prop)}: ${values};\n`;
    },

    /**
     * Combine background image and gradient into one CSS declaration
     * @param {Object} param0
     * @returns CSS declaration
     */
    backgroundImage({ image, gradient }) {
        const result = [];
        if (image) {
            result.push(`url("${image}")`);
        }
        if (gradient) {
            result.push(this.backgroundGradient(gradient));
        }

        return `background-image: ${result.join(', ')};\n`;
    },

    /**
     * @param {array<array>} itrator background gradient CSS processable values
     * @returns {string} CSS declaration
     */
    backgroundGradient(itrator) {
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

        let cssString = '';
        cssString +=
            type === 'linear' ? 'linear-gradient(' : 'radial-gradient(';
        cssString += `${gradientDir}, ${startColor} ${startPos}, ${endColor} ${endPos}`;
        cssString += ')';
        return cssString;
    },

    /**
     * @param {array<array>} itrator box shadow CSS processable values
     * @returns {string} CSS declaration
     */
    boxShadow(value) {
        const mergedValues = { ...defaultValues.boxShadow, ...value };
        const result =
            mergedValues.type !== 'none'
                ? Object.values(mergedValues).join(' ')
                : 'none';

        return `box-shadow: ${result};\n`;
    },
};

export default buildStyle;
