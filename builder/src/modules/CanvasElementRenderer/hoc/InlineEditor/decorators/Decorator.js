import { toolbarEnum } from '../toolbarEnum';

const { LINK, COLOR, CODE, BOLD, SUBSCRIPT, SUPERSCRIPT } = toolbarEnum;

const wrapWithLink = ({ entityKey, contentState }, element) => {
    if (!entityKey) return element;

    const entity = contentState.getEntity(entityKey);
    const entityData = entity ? entity.getData() : undefined;
    const href = (entityData && entityData.url) || undefined;

    return handleWrapper({
        element,
        inlineStyle: LINK,
        attrs: { href, title: href },
    });
};

const getInlineColor = (inlineStyle) => {
    const style = {};

    if (inlineStyle.startsWith('bgcolor-')) {
        style.background = inlineStyle.replace('bgcolor-', '');
    }
    if (inlineStyle.startsWith('color-')) {
        style.color = inlineStyle.replace('color-', '');
    }

    return style;
};

const handleWrapper = ({ element, inlineStyle, style, attrs }) => {
    switch (inlineStyle) {
        case BOLD:
            return <strong>{element}</strong>;
        case CODE:
            return <code>{element}</code>;
        case SUBSCRIPT:
            return <sub>{element}</sub>;
        case SUPERSCRIPT:
            return <sup>{element}</sup>;
        case COLOR:
            return <span style={style}>{element}</span>;
        case LINK:
            return <a {...attrs}>{element}</a>;

        default:
            return element;
    }
};

const wrapWithInlineStyle = (list, element) => {
    let inlineColor = {};
    for (let index = 0; index < list.size; index++) {
        const inlineStyle = list.get(index);

        element = handleWrapper({ element, inlineStyle });
        inlineColor = Object.assign(inlineColor, getInlineColor(inlineStyle));
    }

    if (Object.keys(inlineColor)) {
        element = handleWrapper({
            element,
            style: inlineColor,
            inlineStyle: 'COLOR',
        });
    }

    return element;
};

export const Decorator = (props) => {
    const { children, contentState, start, blockKey } = props;

    const list = contentState
        .getBlockMap()
        .get(blockKey)
        .getInlineStyleAt(start)
        .toList();

    let element = wrapWithInlineStyle(list, children);
    element = wrapWithLink(props, element);

    return element;
};
