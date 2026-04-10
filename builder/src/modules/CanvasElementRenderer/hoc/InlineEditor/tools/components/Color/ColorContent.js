import { useEffect, useState } from 'react';
import { useFrame } from 'react-frame-component';
import { EditorState, Modifier } from 'draft-js';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import {
    toggleCustomInlineStyle,
    getSelectionCustomInlineStyle,
} from 'draftjs-utils';

import { Control } from '../Control';
import isObject from 'util/isObject';
import useGlobals from 'hooks/useGlobals';
import { toolbarEnum } from '../../../toolbarEnum';
import { getGlobalColor } from 'modules/Shared/util';
import { GlobalColors } from 'modules/setting-components/ColorComponent/components/GlobalColors';

const { COLOR, BGCOLOR } = toolbarEnum;

export const ColorContent = (props) => {
    const { colors, setColors } = useGlobals();
    const {
        className,
        getEditorState,
        setEditorState,
        onToolbarClick,
        lastClickedToolbar,
    } = props;
    const { document } = useFrame();

    const [randomKeys, setRandomKeys] = useState({
        color: Math.random(),
        bgcolor: Math.random(),
    });

    const editorState = getEditorState();
    let selection = editorState.getSelection();
    const isCollapsed = selection.isCollapsed();

    const handleChange = ({ value, name }) => {
        if (isObject(value)) {
            value = `var(${value.key})`;
        }

        const key = name.toUpperCase();
        const customStyles = getSelectionCustomInlineStyle(editorState, [key]);

        let contentState = editorState.getCurrentContent();
        contentState = Modifier.removeInlineStyle(
            contentState,
            selection,
            customStyles[key]
        );

        let newState = EditorState.push(
            editorState,
            contentState,
            'change-inline-style'
        );

        newState = toggleCustomInlineStyle(newState, name, value);
        setEditorState(newState);
    };

    const getColorFormSelectedText = (key) =>
        getSelectionCustomInlineStyle(editorState, [key])[key];

    const color = getGlobalColor({
        globalColors: colors,
        currentColor: getColorFormSelectedText(COLOR),
    });

    const bgColor = getGlobalColor({
        globalColors: colors,
        currentColor: getColorFormSelectedText(BGCOLOR),
    });

    const handleUpdateKeys = (key) => {
        setRandomKeys((prev) => ({ ...prev, [key]: Math.random() }));
    };

    const selector = className.includes('slider-contents')
        ? `splide__slide.is-visible .${className}`
        : className;

    useEffect(() => {
        if (lastClickedToolbar !== COLOR) {
            handleUpdateKeys('color');
        }
        if (lastClickedToolbar !== BGCOLOR) {
            handleUpdateKeys('bgcolor');
        }
    }, [lastClickedToolbar]);

    if (isCollapsed) return null;

    return (
        <>
            <GlobalColors
                colors={colors}
                setColors={setColors}
                name="color"
                value={color}
                key={randomKeys.color}
                onChange={handleChange}
                popupContainer={document.querySelector(`.${selector}-color`)}
            >
                <Control
                    isActive={!!color}
                    theme={props.theme}
                    wrapperClass={`${className}-color`}
                    onClick={() => onToolbarClick(COLOR)}
                    icon={icon({
                        style: 'regular',
                        name: 'pen-clip',
                    })}
                />
            </GlobalColors>

            <GlobalColors
                name="bgcolor"
                colors={colors}
                setColors={setColors}
                value={bgColor}
                key={randomKeys.bgcolor}
                onChange={handleChange}
                popupContainer={document.querySelector(`.${selector}-bg`)}
            >
                <Control
                    theme={props.theme}
                    isActive={!!bgColor}
                    wrapperClass={`${className}-bg`}
                    onClick={() => onToolbarClick(BGCOLOR)}
                    icon={icon({
                        style: 'regular',
                        name: 'palette',
                    })}
                />
            </GlobalColors>
        </>
    );
};
