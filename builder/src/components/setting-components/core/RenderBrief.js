import React, { useCallback } from 'react';

function RenderBrief({ brief }) {
    const renderBasicMd = useCallback((string) => {
        const link = string.match(/\((.+)\)/);
        const linkText = string.match(/\[(.+)\]/);
        // TODO: concat regular text
        return (
            <a href={link[1]} target="_blank" rel="noopener noreferrer">
                {linkText[1]}
            </a>
        );
    }, []);

    if (!brief) return null;

    if (typeof brief === 'string') {
        return <div>{renderBasicMd(brief)}</div>;
    } else if (Array.isArray(brief)) {
        return (
            <ul>
                {brief.map((item, i) => (
                    <li key={i}>{renderBasicMd(brief)}</li>
                ))}
            </ul>
        );
    }
}

export default RenderBrief;
