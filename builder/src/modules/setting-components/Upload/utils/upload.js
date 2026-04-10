import { compileHandlebars } from '@dorik/html-parser';

export const getFirstImageURL = ({
    itemId: id,
    value: src,
    templatePageData,
    isTemplatePage,
}) => {
    const isHandleAble = /^{{\w+\.?\w+}}$/gm.test(src);

    //pageMetaImage in template page
    if (!id && isHandleAble && isTemplatePage) {
        return compileHandlebars(src, templatePageData);
    }

    //inside CmsRow
    if (id && isHandleAble) {
        const iframe = document.querySelector('iframe');
        const img = iframe?.contentDocument.querySelector(`.dorik-image-${id}`);
        return img?.src;
    }

    // inside regular row or container
    return src;
};
