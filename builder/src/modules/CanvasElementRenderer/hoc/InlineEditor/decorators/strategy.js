import { toolbarEnum } from '../toolbarEnum';

const { LINK, CODE, BOLD, SUBSCRIPT, SUPERSCRIPT } = toolbarEnum;

const matchesEntityType = (type) => type === LINK;
const code = (inlineStyle) => inlineStyle === CODE;
const bold = (inlineStyle) => inlineStyle === BOLD;
const sub = (inlineStyle) => inlineStyle === SUBSCRIPT;
const sup = (inlineStyle) => inlineStyle === SUPERSCRIPT;
const color = (inlineStyle) =>
    inlineStyle.startsWith('color-') || inlineStyle.startsWith('bgcolor-');

const strategies = [code, bold, color, sub, sup];

const strategyApprover = (inlineStyle) =>
    strategies.some((fn) => fn(inlineStyle));

function inlineStrategy(contentBlock, callback) {
    contentBlock.findStyleRanges((block) => {
        const list = block.getStyle().toList();

        for (let index = 0; index < list.size; index++) {
            const inlineStyle = list.get(index);

            if (strategyApprover(inlineStyle)) {
                return true;
            }
        }
    }, callback);
}

const linkStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                matchesEntityType(contentState.getEntity(entityKey).getType())
            );
        },
        (...args) => {
            callback(...args);
            return true;
        }
    );
};

export function strategy(contentBlock, callback, contentState) {
    if (!contentState) return;

    const hasLink = linkStrategy(contentBlock, callback, contentState);

    if (!hasLink) {
        inlineStrategy(contentBlock, callback);
    }
}
