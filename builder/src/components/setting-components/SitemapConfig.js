import { Switch } from 'antd';
import React, { useContext, useState } from 'react';
import { BuilderContext } from '../../contexts/BuilderContext';
import { EditorContext } from '../../contexts/ElementRenderContext';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';

function SitemapConfig() {
    const { appName, save, useLimit } = useContext(BuilderContext);
    const { page } = useContext(EditorContext);
    const { hasFeaturePermission } = useLimit();
    const [sitemapEnable, setSitemapEnable] = useState(
        page.shouldIncludeInSitemap
    );

    const isFeatureLocked = !hasFeaturePermission({
        excludePlans: ['FREE'],
    });

    const handleSitemap = async (value) => {
        const { id } = page;
        const values = {
            id,
            shouldIncludeInSitemap: value,
        };
        await save(
            {
                pages: [values],
            },
            { isNotify: true }
        );
        setSitemapEnable(value);
    };

    if (appName === 'STATIC' || page.pageType === 'TEMPLATE') {
        return null;
    }

    return (
        <RenderComponentWithLabel
            module={{ label: 'Add to Sitemap', isFeatureLocked }}
        >
            <Switch
                checked={!isFeatureLocked && sitemapEnable}
                onChange={handleSitemap}
                disabled={isFeatureLocked}
            />
        </RenderComponentWithLabel>
    );
}

export default SitemapConfig;
