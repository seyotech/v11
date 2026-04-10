import {
    render,
    screen,
    userEvent,
    waitFor,
    within,
} from '@/util/test-utils.js';

import { nanoid } from 'nanoid';
import Pages from './Pages';

const mockSave = vi.fn();
const mockSelectPage = vi.fn();
const mockOnSelectPage = vi.fn();

const initialContextValues = {
    pages: [],
    selectPage: mockSelectPage,
    onSelectPage: mockOnSelectPage,
    save: mockSave,
    contextState: {},
};

vi.mock('nanoid', async () => ({
    ...(await vi.importActual('nanoid')),
    nanoid: vi.fn(() => 'randomId'),
}));

describe('Pages component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it.each(['CMS', 'STATIC'])('should render the component', (appName) => {
        render(<Pages />, {
            shortContext: { ...initialContextValues, pages: [], appName },
        });
        expect(
            screen.getByRole('button', { name: 'Regular Pages' })
        ).toBeInTheDocument();
    });

    it.each(['CMS', 'STATIC'])(
        'should render the label with correct text',
        (appName) => {
            render(<Pages />, {
                shortContext: { ...initialContextValues, pages: [], appName },
            });
            expect(screen.getByText('Regular Pages')).toBeInTheDocument();
        }
    );

    it.each(['CMS', 'STATIC'])('should render the expand icon', (appName) => {
        render(<Pages />, {
            shortContext: { ...initialContextValues, pages: [], appName },
        });
        expect(screen.getAllByTestId('expand-icon')[0]).toBeInTheDocument();
    });

    it.each(['Regular Pages'])(
        'should expand and collapse when clicked regular page of the page modal accordion',
        async (pageName) => {
            render(<Pages />, {
                shortContext: {
                    initialContextValues,
                    pages: [],
                    appName: 'STATIC',
                },
            });

            const button = screen.getByRole('button', {
                name: pageName,
            });

            expect(button).toHaveAttribute('aria-expanded', 'true');
            await userEvent.click(button);
            expect(button).toHaveAttribute('aria-expanded', 'false');
            await userEvent.click(button);
            expect(button).toHaveAttribute('aria-expanded', 'true');
        }
    );

    it.each(['Utility Pages', 'Template Pages'])(
        'should expand and collapse when clicked utility or template page of the page modal accordion',
        async (pageName) => {
            render(<Pages />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [],
                    appName: 'CMS',
                },
            });

            const button = screen.getByRole('button', {
                name: pageName,
            });

            expect(button).toHaveAttribute('aria-expanded', 'false');
            await userEvent.click(button);
            expect(button).toHaveAttribute('aria-expanded', 'true');
        }
    );

    it('should not render Template pages for STATIC app', async () => {
        render(<Pages />, {
            shortContext: {
                initialContextValues,
                pages: [],
                appName: 'STATIC',
            },
        });

        const templatePages = screen.queryByRole('button', {
            name: 'Template Pages',
        });

        expect(templatePages).not.toBeInTheDocument();
    });

    it('should render template pages only inside Template Pages Accordion', async () => {
        render(<Pages />, {
            shortContext: {
                initialContextValues,
                pages: [
                    {
                        pageType: 'TEMPLATE',
                        name: 'Author',
                        slug: 'author',
                    },
                    {
                        pageType: 'REGULAR',
                        name: 'Contact',
                        slug: 'contact',
                    },
                    {
                        pageType: 'UTIL',
                        name: 'Search',
                        slug: 'search',
                    },
                ],
                appName: 'CMS',
            },
        });

        const button = screen.getByRole('button', {
            name: 'Template Pages',
        });

        await userEvent.click(button);
        const templatePageContent = screen.getByTestId('TEMPLATE-page-tree');

        const authorPage = within(templatePageContent).getByText('Author');
        expect(authorPage).toBeInTheDocument();

        const regularPage = within(templatePageContent).queryByText('Contact');
        expect(regularPage).not.toBeInTheDocument();

        const utilPage = within(templatePageContent).queryByText('Search');
        expect(utilPage).not.toBeInTheDocument();
    });

    it('should render utils pages only inside Utility Pages Accordion', async () => {
        render(<Pages />, {
            shortContext: {
                ...initialContextValues,
                pages: [
                    {
                        pageType: 'TEMPLATE',
                        name: 'Author',
                        slug: 'author',
                    },
                    {
                        pageType: 'REGULAR',
                        name: 'Contact',
                        slug: 'contact',
                    },
                    {
                        pageType: 'UTIL',
                        name: 'Search',
                        slug: 'search',
                    },
                ],
                appName: 'CMS',
            },
        });

        const button = screen.getByRole('button', {
            name: 'Utility Pages',
        });
        await userEvent.click(button);
        const utilPageContent = screen.getByTestId('UTIL-page-tree');

        const authorPage = within(utilPageContent).queryByText('Author');
        expect(authorPage).not.toBeInTheDocument();

        const regularPage = within(utilPageContent).queryByText('Contact');
        expect(regularPage).not.toBeInTheDocument();

        const utilPage = within(utilPageContent).getByText('Search');
        expect(utilPage).toBeInTheDocument();
    });

    it('should render search input field', () => {
        render(<Pages />, {
            shortContext: {
                ...initialContextValues,
                appName: 'CMS',
            },
        });

        const searchInput = screen.getByPlaceholderText('Search');

        expect(searchInput).toBeInTheDocument();
    });

    it('should render modal title in the document', () => {
        render(<Pages />, {
            shortContext: {
                ...initialContextValues,
                appName: 'CMS',
            },
        });

        const modalTitle = screen.getByText('Pages');

        expect(modalTitle).toBeInTheDocument();
    });

    it('should update search state on input change', async () => {
        render(<Pages />, {
            shortContext: {
                ...initialContextValues,
                appName: 'CMS',
            },
        });

        const searchInput = screen.getByPlaceholderText('Search');

        await userEvent.type(searchInput, 'example');

        expect(searchInput.value).toBe('example');
    });

    it('should update search state on search button click', async () => {
        render(<Pages />, {
            shortContext: {
                ...initialContextValues,
                appName: 'CMS',
            },
        });

        const searchInput = screen.getByPlaceholderText('Search');

        await userEvent.type(searchInput, 'example');

        const searchButton = screen.getByRole('img');
        await userEvent.click(searchButton);

        expect(searchInput.value).toBe('example');
    });

    it.each(['STATIC', 'CMS'])(
        'should addRegularPage work correctly for %s page',
        async (appName) => {
            render(<Pages />, {
                shortContext: {
                    ...initialContextValues,
                    appName,
                },
            });

            const addRegularPage = screen.getByTestId('addRegularPage');

            await userEvent.click(addRegularPage);
            expect(nanoid).toHaveBeenCalledWith(6);
            expect(mockSave).toHaveBeenCalledWith(
                {
                    pages: [
                        {
                            name: 'Untitled',
                            slug: 'randomId',
                            pageType: 'REGULAR',
                            data: JSON.stringify({ content: [] }),
                            ...(appName === 'CMS' && {
                                isPasswordEnable: false,
                                status: 'PUBLISHED',
                            }),
                        },
                    ],
                },
                { isNotify: true, isPageSave: true }
            );
        }
    );

    it.each([
        {
            activePanel: 'Regular Pages',
            editPageIndex: 0,
            targetNodeKey: 'node-0-0',
        },
        {
            activePanel: 'Regular Pages',
            editPageIndex: 2,
            targetNodeKey: 'node-0-1-0',
        },
        {
            activePanel: 'Utility Pages',
            editPageIndex: 3,
            targetNodeKey: 'node-0-0',
        },
        {
            activePanel: 'Template Pages',
            editPageIndex: 4,
            targetNodeKey: 'node-0-0',
        },
    ])(
        'should panels be opened with selected page node based on the current edit page type: $activePanel',
        async ({ editPageIndex, activePanel, targetNodeKey }) => {
            render(<Pages />, {
                shortContext: {
                    ...initialContextValues,
                    appName: 'CMS',
                    editPageIndex,
                    pages: [
                        {
                            name: 'Home',
                            slug: 'index',
                            pageType: 'HOMEPAGE',
                        },
                        {
                            name: 'About',
                            slug: 'about',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'History',
                            slug: 'about/history',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'Subscription banner',
                            slug: 'banner',
                            pageType: 'UTIL',
                        },
                        {
                            name: 'Recipie',
                            slug: 'recepie',
                            pageType: 'TEMPLATE',
                        },
                    ],
                },
            });

            const button = await screen.findByRole('button', {
                name: activePanel,
            });

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });
            const targetPage = screen.getByTestId(targetNodeKey);
            expect(
                targetPage.closest('.ant-tree-treenode-selected')
            ).toBeInTheDocument();
        }
    );

    it.each([
        {
            activePanel: 'Regular Pages',
            editPageIndex: 0,
            targetNodeKey: 'node-0-0',
            treeId: 'regular-page-tree',
        },
        {
            activePanel: 'Regular Pages',
            editPageIndex: 1,
            targetNodeKey: 'node-0-0-0',
            treeId: 'regular-page-tree',
        },
        {
            activePanel: 'Utility Pages',
            editPageIndex: 2,
            targetNodeKey: 'node-0-0',
            treeId: 'UTIL-page-tree',
        },
        {
            activePanel: 'Template Pages',
            editPageIndex: 3,
            targetNodeKey: 'node-0-0',
            treeId: 'TEMPLATE-page-tree',
        },
    ])(
        'should the selected page be the current page on click',
        async ({ activePanel, targetNodeKey, editPageIndex, treeId }) => {
            const mockPages = [
                {
                    name: 'About',
                    slug: 'about',
                    pageType: 'REGULAR',
                    id: '1',
                },
                {
                    name: 'History',
                    slug: 'about/history',
                    pageType: 'REGULAR',
                    id: '2',
                },
                {
                    name: 'Subscription banner',
                    slug: 'banner',
                    pageType: 'UTIL',
                    id: '3',
                },
                {
                    name: 'Recipie',
                    slug: 'recepie',
                    pageType: 'TEMPLATE',
                    id: '4',
                },
            ];
            render(<Pages />, {
                shortContext: {
                    ...initialContextValues,
                    pages: mockPages,
                    editPageIndex: 1,
                    appName: 'CMS',
                },
            });
            const button = screen.getByRole('button', {
                name: activePanel,
            });

            if (activePanel !== 'Regular Pages') {
                await userEvent.click(button);
            }
            const treeContainer = screen.getByTestId(treeId);

            const targetPage = within(treeContainer).getByTestId(targetNodeKey);

            await userEvent.click(targetPage);
            expect(mockSelectPage).toHaveBeenCalledWith(
                mockPages[editPageIndex]
            );
            expect(mockOnSelectPage).toHaveBeenCalledWith(editPageIndex);
        }
    );
});
