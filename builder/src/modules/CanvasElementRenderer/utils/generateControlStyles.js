import { elementsWithWrapper } from 'constants/elementsWithWrapper';
import { prefix } from '../../../config';

export const generateControlStyles = (item) => {
    const { isBorderActive } = item;
    const className = `${prefix}-${item.type}-${item.id}`;
    const targetClass = elementsWithWrapper.includes(item.type)
        ? `${className}-wrapper`
        : className;
    const borderClass = `${prefix}-controls-border`,
        controlClass = `${prefix}-element-control__controls`;

    const styles = `
        .${targetClass}:hover .${controlClass} {
            display:flex;
        }
        .${targetClass} .${controlClass} {
            display: none;
        }

        .${targetClass}:hover .${borderClass} {
            display:block
        }
        .${targetClass} .${borderClass} {
            display:${isBorderActive ? 'block' : 'none'};
        }
    `;

    return <style type="text/css">{styles}</style>;
};
