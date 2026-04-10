import { parseHtmlString } from '@dorik/html-parser';
import { generateStyleRecursively } from '@dorik/style-generator';

export const insertCssIntoHtml = ({ html, css, appURL }) => {
    const cssPathRegex = /(\/css\/main.css)/;
    const headClosingTagRegex = /(<\/head>)/;

    // added prefix before `/css/main.css`
    let modifiedHtml = html.replace(cssPathRegex, `${appURL}$1`);

    // added style tag with custom style before the head tag
    modifiedHtml = modifiedHtml.replace(
        headClosingTagRegex,
        (match) => `<style>${css}</style>${match}`
    );
    return modifiedHtml;
};

export const generateContent = async ({ siteData, siteId, permission }) => {
    try {
        const [parsedHtml, generatedCss] = await Promise.all([
            parseHtmlString({ data: siteData, siteId, permission }),
            generateStyleRecursively({ siteData }),
        ]);
        return [parsedHtml, generatedCss];
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error('Failed to generate HTML and CSS.');
    }
};

export const showPublishedSitePreview = async ({
    site,
    page,
    permission,
    dorikAppURL: appURL,
}) => {
    const { pages, global, siteId } = site;

    const siteDetails = {
        pages,
        siteId,
        global,
        page,
    };

    try {
        const [parsedHtml, generatedCss] = await generateContent({
            siteData: siteDetails,
            permission,
            siteId,
        });

        const finalHtml = insertCssIntoHtml({
            appURL,
            css: generatedCss,
            html: parsedHtml.html,
        });

        const newBrowserTab = window.open(``, '_blank');

        if (newBrowserTab) {
            newBrowserTab.document.open();
            newBrowserTab.document.write(finalHtml);
            newBrowserTab.document.close();
        } else {
            console.warn('Popup blocked. Please allow popups for this site.');
        }
    } catch (error) {
        console.error('Error opening site in new tab:', error);
        alert(
            'An error occurred while trying to open the site. Please try again.'
        );
    }
};
