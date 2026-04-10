import { Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from 'react-frame-component';
import { EditorState, Modifier } from 'draft-js';
import EditorUtils from '@draft-js-plugins/utils';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import {
    getEntityRange,
    getSelectionEntity,
    getSelectionText,
} from 'draftjs-utils';

import { Control } from '../Control';
import { toolbarEnum } from '../../../toolbarEnum';
import styled from 'styled-components';
import { LinkInputPopup } from 'modules/setting-components/RichTextEditor/components/Toolbar/Link';

export const LinkWrap = styled.div`
    top: 0;
    left: 0;
    width: 200px;
    z-index: 9999;
    padding: 15px;
    background: #fff;
    position: absolute;
    box-shadow: 0 0 15px 0 rgba(43, 53, 86, 0.15);
    border: 1px solid ${({ theme }) => theme.borderPaleGrey};
    &&& label {
        font-size: 14px;
        font-weight: 500;
    }
`;

export const LinkContent = ({
    theme,
    className,
    setEditorState,
    getEditorState,
    onToolbarClick,
    lastClickedToolbar,
}) => {
    const controlRef = useRef();
    const { document } = useFrame();
    const [open, setOpen] = useState(false);
    const editorState = getEditorState();

    let selection = editorState.getSelection();
    const isCollapsed = selection.isCollapsed();

    const handleClose = () => {
        const selection = editorState.getSelection();

        const newEditorState = EditorState.forceSelection(
            editorState,
            selection
        );
        setEditorState(newEditorState);
        setOpen(false);
    };

    const getCurrentValues = () => {
        const currentEntity = getSelectionEntity(editorState);
        const contentState = editorState.getCurrentContent();
        const currentValues = {};
        if (
            currentEntity &&
            contentState.getEntity(currentEntity).get('type') === 'LINK'
        ) {
            currentValues.link = {};
            const entityRange =
                currentEntity && getEntityRange(editorState, currentEntity);
            currentValues.link.target =
                currentEntity &&
                contentState.getEntity(currentEntity).get('data').url;
            currentValues.link.targetOption =
                currentEntity &&
                contentState.getEntity(currentEntity).get('data')
                    .targetOption === '_blank';
            currentValues.link.title = entityRange && entityRange.text;
        }
        currentValues.selectionText = getSelectionText(editorState);
        return currentValues;
    };

    const addLink = (linkTitle, linkTarget, linkTargetOption) => {
        const editorState = getEditorState();
        const currentEntity = getSelectionEntity(editorState);
        let selection = editorState.getSelection();

        if (currentEntity) {
            const entityRange = getEntityRange(editorState, currentEntity);
            const isBackward = selection.getIsBackward();
            if (isBackward) {
                selection = selection.merge({
                    anchorOffset: entityRange.end,
                    focusOffset: entityRange.start,
                });
            } else {
                selection = selection.merge({
                    anchorOffset: entityRange.start,
                    focusOffset: entityRange.end,
                });
            }
        }
        const entityKey = editorState
            .getCurrentContent()
            .createEntity(toolbarEnum.LINK, 'MUTABLE', {
                url: linkTarget,
                targetOption: linkTargetOption,
            })
            .getLastCreatedEntityKey();

        const contentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            selection,
            `${linkTitle}`,
            editorState.getCurrentInlineStyle(),
            entityKey
        );
        let newEditorState = EditorState.push(
            editorState,
            contentState,
            'insert-characters'
        );

        const selectionRange = selection.set(
            'focusOffset',
            selection.getAnchorOffset() + linkTitle.length
        );

        newEditorState = EditorState.forceSelection(
            newEditorState,
            selectionRange
        );

        setEditorState(newEditorState);
        controlRef.current.parentElement.classList.remove('visible');
        setOpen(false);
    };

    const handleRemoveLink = () =>
        setEditorState(EditorUtils.removeLinkAtSelection(getEditorState()));

    const currentState = getCurrentValues();

    useEffect(() => {
        if (isCollapsed || lastClickedToolbar !== toolbarEnum.LINK) {
            setOpen(false);
        }
    }, [isCollapsed, lastClickedToolbar]);

    const selector = className.includes('slider-contents')
        ? `splide__slide.is-visible .${className}`
        : className;

    useEffect(() => {
        if (selection.isCollapsed()) {
            controlRef.current.parentElement.classList.remove('visible');
        }
    }, [selection]);

    return (
        <>
            <Popover
                open={open}
                arrow={false}
                trigger="click"
                destroyTooltipOnHide
                rootClassName={`${className}-popover`}
                getPopupContainer={() =>
                    document.querySelector(`.${selector} button`)
                }
                content={
                    <LinkWrap>
                        <LinkInputPopup
                            {...currentState}
                            addLink={addLink}
                            onClose={handleClose}
                        />
                    </LinkWrap>
                }
            >
                <Control
                    theme={theme}
                    isPopupOpen={open}
                    controlRef={controlRef}
                    wrapperClass={className}
                    isActive={!!currentState.link}
                    onClick={() => {
                        setOpen((prev) => !prev);
                        onToolbarClick(toolbarEnum.LINK);
                    }}
                    icon={icon({ style: 'regular', name: 'link-horizontal' })}
                />
            </Popover>
            <Control
                theme={theme}
                onClick={handleRemoveLink}
                disabled={!currentState.link}
                icon={icon({ style: 'regular', name: 'link-horizontal-slash' })}
            />
        </>
    );
};
