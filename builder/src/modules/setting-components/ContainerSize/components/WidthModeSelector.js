import React, { useContext } from 'react';
import { Tabs } from 'modules/setting-components/Tabs';
import { ElementContext } from 'contexts/ElementRenderContext';

export function WidthModeSelector(props) {
    const {
        data: { parentType, configuration: { globalWidth } = {} },
        onChange,
        name: path,
    } = props;

    const { editAddress } = useContext(ElementContext);
    const isSecondLevelContainer = editAddress.split('.').length === 3;

    const handleChange = (payload) => {
        const { name, value } = payload;

        onChange([
            { name, value },
            ...(value
                ? [
                      {
                          name: 'style/flexBasis',
                          value: '100%',
                      },
                  ]
                : []),
        ]);
    };

    if (!isSecondLevelContainer && globalWidth) {
        onChange([{ name: path, value: false }]);
    }
    //render for only 2nd level container
    const shouldRenderTab = isSecondLevelContainer && parentType !== 'section';

    if (!shouldRenderTab) {
        return null;
    }

    return <Tabs {...props} onChange={handleChange} />;
}
