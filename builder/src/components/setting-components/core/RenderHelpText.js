import { Trans } from 'react-i18next';
import React, { useContext } from 'react';
import { BuilderContext } from '../../../contexts/BuilderContext';
import { helpLinks } from '../../../helpLinks';

function RenderHelpText({ helpText, t }) {
    let text = helpText;
    const { isWhiteLabelEnabled } = useContext(BuilderContext);
    if (!helpText) return null;

    if (typeof helpText === 'object') {
        if (!helpText.text) return null;
        const type = isWhiteLabelEnabled ? 'whiteLevel' : 'dorik';
        const href = helpLinks[type][helpText.type] || '';
        text = `<a href="${href}" data-testid='${helpText.type}' target='_blank' rel='noopener noreferrer'>${helpText.text}</a>`;
    }

    return (
        <Trans>
            <div
                dangerouslySetInnerHTML={{
                    __html: t(text),
                }}
            />
        </Trans>
    );
}

export default RenderHelpText;
