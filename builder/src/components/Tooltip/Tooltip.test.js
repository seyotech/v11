import * as React from 'react';
import Tooltip from './index.js';
import CMSProviderMock from '../../__mocks__/CMSProviderMock.js';
import { BuilderContext } from '../../contexts/BuilderContext.js';
import { render, screen, userEvent } from '@/util/test-utils';
import { EditorContextProvider } from '../../contexts/ElementRenderContext.js';

const Wrapper = ({ children }) => {
    return <CMSProviderMock>{children}</CMSProviderMock>;
};

const props = {
    effect: 'hover',
    placement: 'top-left',
    content: 'content',
    children: <p>icon</p>,
};
let user;

describe('Tooltip rendering on userEvent', () => {
    let CONTEXT = ({ children, pageProps = {} }) => (
        <BuilderContext.Provider value={{ appName: 'CMS' }}>
            <EditorContextProvider
                value={{ page: { ref: null, ...pageProps } }}
            >
                {children}
            </EditorContextProvider>
        </BuilderContext.Provider>
    );
    beforeEach(() => {
        user = userEvent.setup();
    });

    it('toggleVisibility of tooltip content on hover/unhover tooltipWrap', async () => {
        render(
            <CONTEXT>
                <Tooltip {...props} />
            </CONTEXT>,
            { wrapper: Wrapper }
        );
        const tooltipWrap = screen.getByTestId('tooltip-wrap');
        await user.hover(tooltipWrap);
        expect(screen.getByText('content')).toBeInTheDocument();

        await user.unhover(tooltipWrap);
        expect(screen.queryByText('content')).toBeNull();
    });

    it('hide/show tooltip content on click/dubbleClick to childWrap', async () => {
        render(
            <CONTEXT>
                <Tooltip {...props} effect="click" />
            </CONTEXT>,
            { wrapper: Wrapper }
        );
        const childWrap = screen.getByTestId('child-wrap');
        await user.click(childWrap);
        expect(screen.getByText('content')).toBeInTheDocument();

        await user.click(childWrap);
        expect(screen.queryByText('content')).toBeNull();
    });

    it('on window click', async () => {
        render(
            <CONTEXT>
                <Tooltip {...props} effect="click" />
            </CONTEXT>,
            { wrapper: Wrapper }
        );
        // await user.click(window);
    });
});
