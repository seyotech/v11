import buildStyle from './style-generator';
import { prefix } from '../config';
import isEmpty from './isEmpty';
import idx from './idx';

function styleDeclarations(style, settingStyle) {
    let cssString = '';
    Object.entries(style).forEach(([prop, value]) => {
        // if settings is turned off for specific property
        const disabled = settingStyle && settingStyle[prop] === false;
        // adding CSS declaration with existing ones.
        cssString += disabled ? '' : buildStyle.css(prop, value);
    });
    return cssString;
}

function generalStyles(item, className, settingStyle) {
    let cssString = '';
    if (!isEmpty(item.style)) {
        cssString += `${className} {
            ${styleDeclarations(item.style, settingStyle)}
        }`;
    }

    if (!isEmpty(item.pseudoClass)) {
        Object.keys(item.pseudoClass).forEach((pseudo) => {
            if (!isEmpty(item.pseudoClass[pseudo].style)) {
                cssString += `${className}:${pseudo} {
                    ${styleDeclarations(item.pseudoClass[pseudo].style)}
                }`;
            }
        });
    }

    if (!isEmpty(item.wrapper)) {
        cssString += `${className}-wrapper {
            ${styleDeclarations(item.wrapper)}
        }`;
    }

    return cssString;
}

function mediaQueryStyles(media, className) {
    const devices = { tablet: '991px', mobile: '480px' };
    let cssString = '';
    Object.entries(devices).forEach(([device, size]) => {
        if (!isEmpty(media[device])) {
            cssString += `@media screen and (max-width: ${size}) {
               ${generalStyles(media[device], className)}
            }`;
        }
    });

    return cssString;
}

/**
 * The function generates CSS style decleration
 * from given builder element object
 * @param {Object} item It accepts an object of full content
 * @returns {string} - A CSS style decleration
 */
export default function styleGenerator(item) {
    let cssString = '';
    const { style: settingStyle = {} } = item.settings || {};
    const className = `.${prefix}-${item.type}-${item.id}`;

    cssString += `\n/*${item.name}*/\n`;
    cssString += generalStyles(item, className, settingStyle);

    if (!isEmpty(item.media)) {
        cssString += mediaQueryStyles(item.media, className);
    }

    // Unconvensional styles
    // Column gap derived from row
    if (item.type === 'row') {
        const columnGap = idx(item, (it) => it.settings.columnGap || 30);
        cssString += `
${className}.flex {
    margin-left: calc(-${columnGap} / 2);
    margin-right: calc(-${columnGap} / 2);
}
${className} [class^="col-"] {
    padding-left: calc(${columnGap} / 2);
    padding-right: calc(${columnGap} / 2);
}`;
    }

    return cssString;
}

export const globalStyles = (item) => {
    let cssString = generalStyles(item, 'body');
    if (item.heading) {
        Object.entries(item.heading).forEach(([selector, obj]) => {
            cssString += generalStyles(obj, selector);
        });
    }
    return cssString;
};
