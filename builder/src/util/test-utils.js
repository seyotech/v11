import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react-hooks';

import { render } from '@testing-library/react';

import { ThemeProvider } from 'styled-components';

import { ComponentRenderProvider } from '@dorik/html-parser';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CMSProviderMock from '../__mocks__/CMSProviderMock.js';
import { BuilderContextProvider } from '../contexts/BuilderContext';
import {
    EditorContextProvider,
    ElementContextProvider,
} from '../contexts/ElementRenderContext';
import { AIContextProvider } from '../modules/AI/context/AIContext.js';
import { DnDElementProvider } from '../modules/CanvasElementRenderer/context/DnDElementContext.js';
import { CanvasWrapper } from 'contexts/CanvasContext.js';
import { App } from 'antd';

// import FileUploadContextProvider from 'modules/setting-components/Upload/context/FileUploadContext.js';
import { themes } from '../contexts/ThemeContext.js';

import '../__mocks__/Antd';
import '../__mocks__/i18n.js';
import '../__mocks__/matchMedia';
import initialData from '../initialData.js';

const noop = () => {};
const elementContextMethods = {
    onSaveSettings: noop,
    setGlobalState: noop,
    getDataByAddress: noop,
};

export const AllTheProviders = ({
    shortContext = {},
    aiContext = {},
    builderContext = {},
    elementContext = {},
    editorContext = {},
    componentRenderContext = {},
    cmsContext = {},
    canvasContext = {},
}) => {
    return ({ children }) => (
        <App>
            <ThemeProvider theme={themes.light}>
                <CMSProviderMock value={{ ...shortContext, ...cmsContext }}>
                    <ComponentRenderProvider
                        value={{ ...shortContext, ...componentRenderContext }}
                    >
                        <BuilderContextProvider
                            value={{
                                isWhiteLabelEnabled: false,
                                ...shortContext,
                                ...builderContext,
                            }}
                        >
                            <AIContextProvider
                                ctx={{ ...shortContext, ...aiContext }}
                            >
                                <EditorContextProvider
                                    value={{
                                        ...initialData,
                                        ...shortContext,
                                        ...editorContext,
                                    }}
                                >
                                    <ElementContextProvider
                                        value={{
                                            ...elementContextMethods,
                                            ...shortContext,
                                            ...elementContext,
                                        }}
                                    >
                                        <EditorContextProvider
                                            value={{
                                                ...initialData,
                                                ...shortContext,
                                                ...editorContext,
                                            }}
                                        >
                                            <CanvasWrapper
                                                {...{
                                                    ...shortContext,
                                                    ...canvasContext,
                                                    currentEditAddress:
                                                        () => {},
                                                    aiLoadingState: {},
                                                }}
                                            >
                                                <DndProvider
                                                    backend={HTML5Backend}
                                                >
                                                    <DnDElementProvider>
                                                        {children}
                                                    </DnDElementProvider>
                                                </DndProvider>
                                            </CanvasWrapper>
                                        </EditorContextProvider>
                                    </ElementContextProvider>
                                </EditorContextProvider>
                            </AIContextProvider>
                        </BuilderContextProvider>
                    </ComponentRenderProvider>
                </CMSProviderMock>
            </ThemeProvider>
        </App>
    );
};

const customRender = (
    ui,
    {
        shortContext,
        aiContext,
        builderContext,
        elementContext,
        editorContext,
        componentRenderContext,
        cmsContext,
        canvasContext,
        ...libOptions
    } = {}
) => {
    const Wrapper = AllTheProviders({
        shortContext,
        aiContext,
        builderContext,
        elementContext,
        editorContext,
        componentRenderContext,
        cmsContext,
        canvasContext,
    });
    return render(ui, { wrapper: Wrapper, ...libOptions });
};
const customRenderHook = (
    hook,
    {
        initialProps,
        shortContext,
        aiContext,
        builderContext,
        elementContext,
        editorContext,
        componentRenderContext,
        cmsContext,
        ...libOptions
    } = {}
) => {
    const Wrapper = AllTheProviders({
        shortContext,
        aiContext,
        builderContext,
        elementContext,
        editorContext,
        componentRenderContext,
        cmsContext,
    });
    return renderHook(hook, {
        wrapper: Wrapper,
        initialProps,
        ...libOptions,
    });
};

/**
 * Wait for a time delay. Will wait `advanceTime * times` ms.
 *
 * @param advanceTime Default 1000
 * @param times Default 3
 */
export async function waitFakeTimer(advanceTime = 1000, times = 3) {
    for (let i = 0; i < times; i += 1) {
        await act(async () => {
            await Promise.resolve();

            if (advanceTime > 0) {
                vi.advanceTimersByTime(advanceTime);
            } else {
                vi.runAllTimers();
            }
        });
    }
}

export const initFakeTimer = () => {
    beforeAll(() => {
        vi.useFakeTimers();
    });

    afterAll(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.clearAllTimers();
    });
};

// re-export everything
export * from '@testing-library/react';
export * from '@testing-library/user-event';

// override render method & other helper packages
export { act, customRender as render, customRenderHook as renderHook };
