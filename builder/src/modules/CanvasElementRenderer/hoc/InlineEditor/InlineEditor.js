import draftToHtml from 'draftjs-to-html';
import Editor from '@draft-js-plugins/editor';
import { RichUtils, convertToRaw, getDefaultKeyBinding } from 'draft-js';
import React, {
    useRef,
    useState,
    useContext,
    forwardRef,
    useEffect,
} from 'react';
import {
    SubButton,
    SupButton,
    CodeButton,
    BoldButton,
    ItalicButton,
    UnderlineButton,
    OrderedListButton,
    UnorderedListButton,
} from '@draft-js-plugins/buttons';

import { decorators } from './decorators';
import { COMPONENT_SETTINGS } from 'constants';
import { InlineEditorStc } from './InlineEditor.stc';
import { useEditorState } from '../../hooks/useEditorState';
import { ElementContext } from 'contexts/ElementRenderContext';
import { useInlineToolbar } from '../../hooks/useInlineToolbar';
import {
    generatePayload,
    getEditorContent,
    isAllowedEnter,
} from '../../utils/editor';
import { StrikeThrough, linkPlugin, colorPlugin, eraserPlugin } from './tools';

export const InlineEditor = forwardRef((props, ref) => {
    const elementRef = useRef();
    const { path = 'content', address } = props;
    const { plugins, InlineToolbar } = useInlineToolbar();
    const { onSaveSettings, getDataByAddress, showSettingsModal } =
        useContext(ElementContext);
    const item = getDataByAddress(address);

    const editorContent = getEditorContent({ name: path, item });

    const [editorState, setEditorState] = useEditorState(editorContent);
    const [lastClickedToolbar, setLastClickedToolbar] = useState(null);

    const onEditorStateChange = (editorState) => {
        const currentContent = editorState.getCurrentContent();
        if (currentContent.getPlainText().includes('javascript:void(0)'))
            return;
        const rawData = convertToRaw(currentContent);
        let html = draftToHtml(rawData);

        if (html === '<p></p>\n') {
            html = '<p> </p>\n';
        }

        setEditorState(editorState);
        const payload = generatePayload(path, item, html);

        onSaveSettings(payload, address);
    };

    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleExit = ({ keyCode }) => {
        if (keyCode === 27) {
            ref.current = null;
            showSettingsModal(COMPONENT_SETTINGS, address);
        }
    };

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return true;
        }
        return false;
    };

    const key = path.replaceAll('/', '-');
    const linkClass = `link--${key}`,
        colorClass = `color--${key}`;

    const handleReturn = ({ code }) => {
        if (code === 'Enter' && !isAllowedEnter(editorState)) {
            const newState = RichUtils.insertSoftNewline(editorState);
            ref.current.onChange(newState);
            return 'handled';
        }

        return 'not_handled';
    };

    // Uncomment the code below to enable background updates in the inline editor as well.
    // const debouncedUpdateBG = useCallback(
    //     debounce(() => {
    //         updateEditorBG(ref.current?.wrapper);
    //     }, 1000),
    //     []
    // );

    useEffect(() => {
        if (ref.current.sync) {
            const editorState = ref.current.getEditorState();

            if (!editorState.getSelection().hasFocus) {
                setEditorState(editorContent);
            }
        } else {
            ref.current.sync = true;
        }

        // Uncomment the code below to enable background updates in the inline editor as well.
        // debouncedUpdateBG()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, editorContent]);

    return (
        <InlineEditorStc
            as={props.as}
            ref={elementRef}
            onKeyUp={handleExit}
            linkClass={linkClass}
            onClick={handleClick}
            className={props.className}
        >
            <p>
                <Editor
                    ref={ref}
                    plugins={plugins}
                    decorators={decorators}
                    editorState={editorState}
                    handleReturn={handleReturn}
                    editorKey={`editor-${path}`}
                    onChange={onEditorStateChange}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={getDefaultKeyBinding}
                />
                <InlineToolbar>
                    {(externalProps) => (
                        <>
                            <BoldButton {...externalProps} />
                            <ItalicButton {...externalProps} />
                            <UnderlineButton {...externalProps} />
                            <StrikeThrough {...externalProps} />
                            <CodeButton {...externalProps} />
                            <SupButton {...externalProps} />
                            <SubButton {...externalProps} />
                            <UnorderedListButton {...externalProps} />
                            <OrderedListButton {...externalProps} />
                            <linkPlugin.Component
                                className={linkClass}
                                {...externalProps}
                                onToolbarClick={setLastClickedToolbar}
                                lastClickedToolbar={lastClickedToolbar}
                            />
                            <colorPlugin.Component
                                {...externalProps}
                                className={colorClass}
                                onToolbarClick={setLastClickedToolbar}
                                lastClickedToolbar={lastClickedToolbar}
                            />
                            <eraserPlugin.Component
                                {...externalProps}
                                onToolbarClick={setLastClickedToolbar}
                            />
                        </>
                    )}
                </InlineToolbar>
            </p>
        </InlineEditorStc>
    );
});
