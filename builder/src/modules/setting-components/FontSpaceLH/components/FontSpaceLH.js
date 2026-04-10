import { Space } from 'antd';
import RenderTemplate from 'components/setting-components/core/RenderTemplate';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import React from 'react';

const FontSpaceLH = (props) => {
    const { module, ...restOfProps } = props;
    const { modules } = module;
    return (
        <RenderComponentWithLabel {...props}>
            <Space style={{ width: '100%' }}>
                {modules.map((mod, modIndex) => (
                    <RenderTemplate
                        {...restOfProps}
                        module={mod}
                        key={modIndex}
                    />
                ))}
            </Space>
        </RenderComponentWithLabel>
    );
};

export default React.memo(FontSpaceLH);
