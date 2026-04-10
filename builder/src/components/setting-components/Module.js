/*****************************************************
 * Pakages
 ******************************************************/
import styled from 'styled-components';
import React, { useContext } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import getResource from '../../util/getResource';
import settingComponentsLib from './index';
import deepCopy from '../../util/deepCopy';
import { ThemeContext } from 'styled-components';
import { ElementContext } from '../../contexts/ElementRenderContext';

/*****************************************************
 * Styles
 ******************************************************/
const StyleInput = styled.div`
    margin-top: 20px;
`;

const Module = (props) => {
    const theme = useContext(ThemeContext);
    const { responsiveEditorMode: mode } = useContext(ElementContext);
    const {
        module,
        activeHover,
        handleChnage,
        currentEditItem,
        activeStyleGroup,
    } = props;
    const item = deepCopy(getResource(module));
    const mqEnabled = item.isResponsible && mode !== 'desktop';
    const Component = settingComponentsLib[item.template] || 'div';
    let path = typeof module === 'string' ? module : module[0];
    const value = getResource(path, currentEditItem);
    // Media query editing path
    let mediaQueryValue;
    if (mqEnabled) {
        const styleProp = path.split('/').slice(1).join('/');
        path = `media/${mode}/${styleProp}`;
        mediaQueryValue = getResource(path, currentEditItem);
    }
    if (activeHover && !item.hoverable) return null;
    // if (value === undefined) return null;
    return (
        <Component
            theme={theme}
            label={item.name}
            type={item.inputType}
            module={item} // should remove/update
            mqValue={mediaQueryValue}
            mqEnabled={mqEnabled}
            value={value}
            name={path}
            onChange={handleChnage}
        />
    );
};
export default React.memo(Module);
