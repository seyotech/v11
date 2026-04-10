import * as React from 'react';
import { render, screen, userEvent } from '@/util/test-utils';

import DropdownInput from './CmsDropdown.js';
import CMSProviderMock from '../../../__mocks__/CMSProviderMock.js';
import {
    input1,
    output1,
    input2,
    output2,
    input3,
} from './__mocks__/cms-dropdown.js';
import { EditorContextProvider } from '../../../contexts/ElementRenderContext';
import { getDropdownItems } from '../../../util/getDropdownItems';

import { BuilderContext } from '../../../contexts/BuilderContext';
import { within } from '@testing-library/react';

describe('CMS Dropdown Component for TOPIC/Collection pages', () => {
    let user;
    let TOPIC = ({ children }) => (
        <EditorContextProvider value={{ page: { ref: 'TOPIC' } }}>
            {children}
        </EditorContextProvider>
    );
    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should test useRenderFields hook returns 4 li', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <TOPIC>
                    <DropdownInput cmsFields={['TEXT', 'IMAGE', 'RICH_TEXT']} />
                </TOPIC>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(4);
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Image')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Color')).toBeInTheDocument();
    });

    it('should render only IMAGE type fields', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <TOPIC>
                    <DropdownInput cmsFields={['IMAGE']} />
                </TOPIC>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(1);
        expect(screen.getByText('Image')).toBeInTheDocument();
    });

    it('should render everything without IMAGE type fields', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <TOPIC>
                    <DropdownInput cmsFields={['!IMAGE']} />
                </TOPIC>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    });

    it('should render every fields without IMAGE & TEXT type fields', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <TOPIC>
                    <DropdownInput cmsFields={['!IMAGE', '!TEXT']} />
                </TOPIC>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(1);
    });
});

describe('CMS Dropdown Component for POST page', () => {
    let user;
    let POST = ({ children }) => (
        <EditorContextProvider value={{ page: { ref: 'POST' } }}>
            {children}
        </EditorContextProvider>
    );
    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should test useRenderFields hook returns 11 li', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <POST>
                    <DropdownInput cmsFields={['TEXT', 'IMAGE', 'RICH_TEXT']} />
                </POST>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(11);
        expect(screen.getByText('Post Content')).toBeInTheDocument();
        expect(screen.getByText('Banner Image')).toBeInTheDocument();
    });

    it('should render only IMAGE type fields', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <POST>
                    <DropdownInput cmsFields={['IMAGE']} />
                </POST>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(1);
        expect(screen.getByText('Banner Image')).toBeInTheDocument();
    });

    it('should render everything without IMAGE type fields', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <POST>
                    <DropdownInput cmsFields={['!IMAGE']} />
                </POST>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(10);
    });

    it('should render every fields without IMAGE & TEXT type fields', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <POST>
                    <DropdownInput cmsFields={['!IMAGE', '!RICH_TEXT']} />
                </POST>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(9);
    });
});

describe('CMS Dropdown Component for CATEGORY pages', () => {
    let user;
    let CATEGORY = ({ children }) => (
        <EditorContextProvider value={{ page: { ref: 'CATEGORY' } }}>
            {children}
        </EditorContextProvider>
    );
    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should test useRenderFields hook returns 4 li', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <CATEGORY>
                    <DropdownInput cmsFields={['TEXT']} />
                </CATEGORY>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(5);
        expect(screen.getByText('Category Name')).toBeInTheDocument();
        expect(screen.getByText('Update Date')).toBeInTheDocument();
        expect(screen.getByText('Creation Date')).toBeInTheDocument();
    });
});

describe('CMS Dropdown Component for TAG pages', () => {
    let user;
    let TAG = ({ children }) => (
        <EditorContextProvider value={{ page: { ref: 'TAG' } }}>
            {children}
        </EditorContextProvider>
    );
    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should test useRenderFields hook returns 4 li', async () => {
        render(
            <BuilderContext.Provider value={{ appName: 'STATIC' }}>
                <TAG>
                    <DropdownInput cmsFields={['TEXT']} />
                </TAG>
            </BuilderContext.Provider>
        );
        await user.click(screen.getByTestId('cms-dropdown-btn'));

        expect(screen.getAllByRole('menuitem')).toHaveLength(5);
        expect(screen.getByText('Tag Slug')).toBeInTheDocument();
        expect(screen.getByText('Update Date')).toBeInTheDocument();
        expect(screen.getByText('Creation Date')).toBeInTheDocument();
    });
});

describe('getDropdownItems', () => {
    const filterAbleFields = [null, undefined, []];
    test.each(filterAbleFields)('should return [] if input is %s', (fields) => {
        const result = getDropdownItems(fields);
        expect(result).toEqual([]);
    });

    test.each([
        [input1, output1],
        [input2, output2],
    ])(
        'should return, when input is %o then output should be %o',
        (input, output) => {
            const result = getDropdownItems(input);
            expect(result).toMatchObject(output);
        }
    );
});

describe('onChange', () => {
    let user;

    let TOPIC = ({ children }) => (
        <EditorContextProvider value={{ page: { ref: 'TOPIC' } }}>
            {children}
        </EditorContextProvider>
    );

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should onChange called with empty value', async () => {
        const storePath = 'user-collection';
        const wrapper = ({ children }) => (
            <CMSProviderMock topic={input1}>{children}</CMSProviderMock>
        );
        const mockOnChange = vi.fn();
        render(
            <TOPIC>
                <DropdownInput
                    name={storePath}
                    onChange={mockOnChange}
                    cmsFields={['TEXT', 'IMAGE', 'RICH_TEXT']}
                />
            </TOPIC>,
            {
                wrapper,
            }
        );

        await user.click(screen.getByTestId('cms-dropdown-btn'));
        const { name, code } = input1[1];
        await user.click(screen.getByText(name));
        expect(mockOnChange).toHaveBeenCalled();
        expect(mockOnChange).toHaveBeenCalledWith({
            name: storePath,
            value: code,
        });
    });

    it('should onChange called with "{{description}} {data}"', async () => {
        const storePath = 'user-collection';
        const initialValue = '{{description}} {data}';
        const wrapper = ({ children }) => (
            <CMSProviderMock topic={input1}>{children}</CMSProviderMock>
        );
        const mockOnChange = vi.fn();
        render(
            <TOPIC>
                <DropdownInput
                    name={storePath}
                    value={initialValue}
                    onChange={mockOnChange}
                    cmsFields={['TEXT', 'IMAGE', 'RICH_TEXT']}
                />
            </TOPIC>,
            {
                wrapper,
            }
        );

        await user.click(screen.getByTestId('cms-dropdown-btn'));
        const { name, code } = input1[1];
        await user.click(screen.getByText(name));
        expect(mockOnChange).toHaveBeenCalled();
        expect(mockOnChange).toHaveBeenCalledWith({
            name: storePath,
            value: initialValue + code,
        });
    });

    it('should onChange called with input2', async () => {
        const wrapper = ({ children }) => (
            <CMSProviderMock topic={input2}>{children}</CMSProviderMock>
        );
        const storePath = 'my-store-path';
        const mockOnChange = vi.fn();
        render(
            <TOPIC>
                <DropdownInput
                    cmsFields={[
                        'TEXT',
                        'IMAGE',
                        'RICH_TEXT',
                        'SINGLE_REFERENCE',
                    ]}
                    onChange={mockOnChange}
                    name={storePath}
                />
            </TOPIC>,
            {
                wrapper,
            }
        );

        await user.click(screen.getByTestId('cms-dropdown-btn'));

        const { name, code } = input2[3].codes[1];
        await user.click(screen.getByText(name));
        expect(mockOnChange).toHaveBeenCalled();
        expect(mockOnChange).toHaveBeenCalledWith({
            name: storePath,
            value: code,
        });
    });

    it('should onChange called with input2 with "{{age}} ', async () => {
        const wrapper = ({ children }) => (
            <CMSProviderMock topic={input2}>{children}</CMSProviderMock>
        );
        const storePath = 'my-store-path';
        const initialValue = '{{age}} ';
        const mockOnChange = vi.fn();
        render(
            <TOPIC>
                <DropdownInput
                    cmsFields={[
                        'TEXT',
                        'IMAGE',
                        'RICH_TEXT',
                        'SINGLE_REFERENCE',
                    ]}
                    onChange={mockOnChange}
                    value={initialValue}
                    name={storePath}
                />
            </TOPIC>,
            {
                wrapper,
            }
        );

        await user.click(screen.getByTestId('cms-dropdown-btn'));

        const { name, code } = input2[3].codes[1];
        await user.click(screen.getByText(name));
        expect(mockOnChange).toHaveBeenCalled();
        expect(mockOnChange).toHaveBeenCalledWith({
            name: storePath,
            value: initialValue + code,
        });
    });
    it('should the single ref dropdown work properly and call ref handler', async () => {
        const storePath = 'user-collection';
        const mockHandleSingleRefData = vi.fn();
        const wrapper = ({ children }) => (
            <CMSProviderMock
                topic={input3}
                handleSingleRefData={mockHandleSingleRefData}
            >
                {children}
            </CMSProviderMock>
        );
        const mockOnChange = vi.fn();

        render(
            <TOPIC>
                <DropdownInput
                    name={storePath}
                    onChange={mockOnChange}
                    cmsFields={[
                        'TEXT',
                        'IMAGE',
                        'RICH_TEXT',
                        'SINGLE_REFERENCE',
                    ]}
                />
            </TOPIC>,
            {
                wrapper,
            }
        );

        await user.click(screen.getByTestId('cms-dropdown-btn'));
        const { name, refTopic, codes } = input3[0];

        const singleRef = screen.getByRole('menuitem', {
            name: new RegExp(name, 'i'),
        });
        await user.hover(singleRef);
        expect(
            within(singleRef).getByRole('menuitem', {
                name: new RegExp(codes[0].name, 'i'),
            })
        ).toBeInTheDocument();

        expect(
            within(singleRef).getByRole('menuitem', {
                name: new RegExp(codes[1].name, 'i'),
            })
        ).toBeInTheDocument();

        // expect(mockHandleSingleRefData).toHaveBeenCalledWith({
        //     refTopic,
        // });
    });
});
