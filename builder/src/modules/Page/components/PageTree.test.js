/* eslint-disable testing-library/no-node-access */
import {
    fireEvent,
    render,
    screen,
    userEvent,
    waitFor,
    within,
} from '@/util/test-utils';
import { nanoid } from 'nanoid';

import PageTree from './PageTree';

vi.mock('nanoid', async () => ({
    ...(await vi.importActual('nanoid')),
    nanoid: vi.fn(() => 'randomId'),
}));

describe('PageTree', () => {
    // Mocking the useContext value
    const mockPages = [
        { slug: 'index', name: 'Home', id: 4, pageType: 'HOMEPAGE' },
        { slug: 'page1', name: 'Page 1', id: 1, pageType: 'REGULAR' },
        { slug: 'page2', name: 'Page 2', id: 2, pageType: 'REGULAR' },
        { slug: 'page3', name: 'Page 3', id: 3, pageType: 'REGULAR' },
    ];

    const mockSave = vi.fn();
    const mockSelectPage = vi.fn();
    const mockOnSelectPage = vi.fn();
    const mockAsyncGetPageDataById = vi.fn(async () => {
        return {};
    });

    const initialContextValues = {
        pages: mockPages,
        editPageIndex: 0,
        selectPage: mockSelectPage,
        onSelectPage: mockOnSelectPage,
        save: mockSave,
        getPageDataById: mockAsyncGetPageDataById,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Pagetree initial', () => {
        it('renders the page tree with correct tree data', () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                },
            });

            // Verify that the tree data is rendered correctly
            const page1Node = screen.getByText('Page 1');
            const page2Node = screen.getByText('Page 2');
            const page3Node = screen.getByText('Page 3');

            expect(page1Node).toBeInTheDocument();
            expect(page2Node).toBeInTheDocument();
            expect(page3Node).toBeInTheDocument();
        });

        it('renders the page tree with icons and titles', () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                },
            });

            // Verify that the icons and titles are rendered correctly
            const [page1Icon, page2Icon, page3Icon] =
                screen.getAllByTestId('file');
            const home = screen.getByTestId('house');

            expect(page1Icon).toBeInTheDocument();
            expect(page2Icon).toBeInTheDocument();
            expect(page3Icon).toBeInTheDocument();
            expect(home).toBeInTheDocument();

            const page1Title = screen.getByText('Page 1');
            const page2Title = screen.getByText('Page 2');
            const page3Title = screen.getByText('Page 3');
            const page4Title = screen.getByText('Home');

            expect(page1Title).toBeInTheDocument();
            expect(page2Title).toBeInTheDocument();
            expect(page3Title).toBeInTheDocument();
            expect(page4Title).toBeInTheDocument();
        });

        it('renders the page tree with nested pages', async () => {
            const handleContextMenu = vi.fn();
            render(<PageTree handleContextMenu={handleContextMenu} />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            name: 'Home',
                            slug: 'index',
                            pageType: 'HOMEPAGE',
                        },
                        {
                            name: 'En',
                            slug: 'en',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'About',
                            slug: 'en/about',
                            pageType: 'REGULAR',
                        },
                    ],
                },
            });

            const parentPage = screen.getByTestId('node-0-1');
            await userEvent.click(parentPage);
            const childPage = screen.queryByTestId('node-0-1-0');

            expect(parentPage).toBeInTheDocument();
            expect(childPage).toBeInTheDocument();
        });

        it('renders the page tree with current selected page node without children', async () => {
            const editPageIndex = 2;

            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: mockPages,
                    editPageIndex,
                },
            });

            const targetPage = screen.getByText('Page 2');
            await waitFor(() => {
                expect(
                    targetPage.closest('.ant-tree-treenode-selected')
                ).toBeInTheDocument();
            });
        });

        it('renders the page tree with current selected child page having all the previous parents expanded', async () => {
            const editPageIndex = 3;

            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            name: 'Home',
                            slug: 'index',
                            pageType: 'HOMEPAGE',
                        },
                        {
                            name: 'En',
                            slug: 'en',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'About',
                            slug: 'en/about',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'History',
                            slug: 'en/about/history',
                            pageType: 'REGULAR',
                        },
                    ],
                    editPageIndex,
                },
            });

            const targetPage = screen.getByText('History');
            await waitFor(() => {
                expect(
                    targetPage.closest('.ant-tree-treenode-selected')
                ).toBeInTheDocument();
            });
        });

        it('should not render template pages', async () => {
            const handleContextMenu = vi.fn();
            render(<PageTree handleContextMenu={handleContextMenu} />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            name: 'En',
                            slug: 'en',
                            pageType: 'TEMPLATE',
                        },
                        {
                            name: 'About',
                            slug: 'en/about',
                            pageType: 'TEMPLATE',
                        },
                        {
                            name: 'Contact',
                            slug: 'contact',
                            pageType: 'REGULAR',
                        },
                    ],
                },
            });

            const parentPage = screen.queryByText('En');
            expect(parentPage).not.toBeInTheDocument();
            const childPage = screen.queryByText('About');
            expect(childPage).not.toBeInTheDocument();

            const regularPage = screen.queryByText('Contact');
            expect(regularPage).toBeInTheDocument();
        });

        test('renders the switcher icon with correct rotation when node is expanded', async () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            name: 'Home',
                            slug: 'index',
                            pageType: 'HOMEPAGE',
                        },
                        {
                            name: 'En',
                            slug: 'en',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'About',
                            slug: 'en/about',
                            pageType: 'REGULAR',
                        },
                    ],
                },
            });

            // Wait for the component to fetch and render the tree data
            const parentPage = screen.getByText('En');

            // Click on the switcher icon to expand the node
            await userEvent.click(parentPage);

            // Assert that the switcher icon has the correct rotation class
            expect(screen.getByTestId('switcher-icon')).toHaveClass(
                'fa-rotate-90'
            );
            await userEvent.click(parentPage);
            expect(screen.getByTestId('switcher-icon')).not.toHaveClass(
                'fa-rotate-90'
            );
        });

        test('should render "No Page Available" when pages are empty', async () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [],
                },
            });

            expect(screen.getByText('No Page Available')).toBeInTheDocument();
        });

        test('should render loading spinner when isSaving is true', async () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            name: 'About',
                            slug: 'en/about',
                            pageType: 'REGULAR',
                        },
                    ],
                    isSaving: true,
                },
            });

            expect(screen.getByRole('tree').parentElement).toHaveClass(
                'ant-spin-blur'
            );
        });

        it('handles onDrop event correctly', async () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            name: 'Page 1',
                            slug: 'page-1',
                            pageType: 'REGULAR',
                            id: 1,
                        },
                        {
                            name: 'Parent',
                            slug: 'parent',
                            pageType: 'REGULAR',
                            id: 3,
                        },
                        {
                            name: 'Child Page',
                            slug: 'parent/child',
                            pageType: 'REGULAR',
                            id: 4,
                        },
                        {
                            name: 'Orphan Child',
                            slug: 'no-parent/orphan-child',
                            pageType: 'REGULAR',
                            id: 5,
                        },
                    ],
                },
            });

            // Find the draggable node and the drop target node
            const draggableElement = screen.getByText('Parent');
            const droppableArea = screen.getByText('Page 1');

            dragAndDrop({ draggableElement, droppableArea });

            expect(mockSave).toHaveBeenCalledWith(
                {
                    pages: [
                        { id: 3, slug: 'page-1/parent', pageType: 'REGULAR' },
                        {
                            id: 4,
                            slug: 'page-1/parent/child',
                            pageType: 'REGULAR',
                        },
                    ],
                },
                { isNotify: true, redirectPageId: 3 }
            );

            // reset after first called
            mockSave.mockReset();

            const unknownPage = screen.getByText('Unknown');

            dragAndDrop({ draggableElement, droppableArea: unknownPage });
            expect(mockSave).not.toHaveBeenCalled();
        });

        it('draggable nodes are disabled for root, index and unknown pages (child pages are enabled)', async () => {
            render(<PageTree search="" />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            slug: '/',
                            name: 'Home',
                            pageType: 'HOMEPAGE',
                            id: 1,
                        },
                        {
                            slug: 'index',
                            name: 'Home Alt',
                            pageType: 'REGULAR',
                            id: 2,
                        },
                        {
                            slug: 'contact',
                            name: 'Contact',
                            pageType: 'REGULAR',
                            id: 3,
                        },
                        {
                            name: 'About',
                            slug: 'en/about',
                            pageType: 'REGULAR',
                            id: 4,
                        },
                    ],
                },
            });

            const rootNode = screen.getByText('Home');
            const rootAlt = screen.getByText('Home Alt');
            const unknown = screen.getByText('Unknown');
            const childPage = screen.getByText('Contact');

            expect(rootNode.closest('.ant-tree-treenode')).toHaveAttribute(
                'draggable',
                'false'
            );

            expect(rootAlt.closest('.ant-tree-treenode')).toHaveAttribute(
                'draggable',
                'false'
            );

            expect(unknown.closest('.ant-tree-treenode')).toHaveAttribute(
                'draggable',
                'false'
            );

            expect(childPage.closest('.ant-tree-treenode')).toHaveAttribute(
                'draggable',
                'true'
            );
        });

        it('should properly handle home page and unknown page to the tree', async () => {
            mockSave.mockReset();

            render(<PageTree search="" />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            slug: 'contact',
                            name: 'Contact',
                            pageType: 'REGULAR',
                        },

                        {
                            slug: 'blog',
                            name: 'Blog',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'About',
                            slug: 'en/about/me',
                            pageType: 'REGULAR',
                        },
                        {
                            slug: '/',
                            name: 'Home',
                            pageType: 'HOMEPAGE',
                        },
                        {
                            name: 'Blog',
                            slug: 'blogs/blog-1',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'Blogs',
                            slug: 'blogs',
                            pageType: 'REGULAR',
                        },
                    ],
                },
            });

            const home = screen.getByTestId('node-0-0');
            expect(home).toHaveTextContent('Home');

            const blog = screen.getByTestId('node-0-2');
            expect(blog).toHaveTextContent('Blog');

            // should not saved be called inside home
            dragAndDrop({ draggableElement: blog, droppableArea: home });
            expect(mockSave).not.toHaveBeenCalled();

            const contact = screen.getByTestId('node-0-1');
            expect(contact).toHaveTextContent('Contact');

            const unknown1 = screen.getByTestId('node-0-3');
            expect(unknown1).toHaveTextContent('Unknown');

            await userEvent.click(unknown1);
            const unknown2 = screen.getByTestId('node-0-3-0');
            expect(unknown2).toHaveTextContent('Unknown');

            // should not saved be called inside unknown1
            dragAndDrop({ draggableElement: blog, droppableArea: unknown1 });
            expect(mockSave).not.toHaveBeenCalled();

            await userEvent.click(unknown2);
            const about = await screen.findByTestId('node-0-3-0-0');
            expect(about).toHaveTextContent('About');

            // should not saved be called inside unknown2
            dragAndDrop({ draggableElement: blog, droppableArea: unknown2 });
            expect(mockSave).not.toHaveBeenCalled();

            const blogs = screen.getByTestId('node-0-4');
            expect(blogs).toHaveTextContent('Blogs');
        });

        test('does not render the node when searching for a non-matching node', async () => {
            render(<PageTree search="test" />, {
                shortContext: {
                    ...initialContextValues,
                },
            });

            // Assert that the non-matching node is not rendered
            expect(screen.queryByText('Page 1')).toBeNull();
            expect(screen.queryByText('Page 2')).toBeNull();
            expect(screen.queryByText('Page 3')).toBeNull();
        });

        test.each(['About', 'Contact'])(
            'can not drag and drop the node when searching page',
            async (pageName) => {
                render(<PageTree search={pageName} />, {
                    shortContext: {
                        ...initialContextValues,
                        pages: [
                            {
                                slug: '/',
                                name: 'Home',
                                pageType: 'HOMEPAGE',
                            },
                            {
                                slug: 'index',
                                name: 'Home Alt',
                                pageType: 'REGULAR',
                            },
                            {
                                slug: 'contact',
                                name: 'Contact',
                                pageType: 'REGULAR',
                            },
                            {
                                name: 'About',
                                slug: 'about',
                                pageType: 'REGULAR',
                            },
                        ],
                    },
                });

                // Assert that the non-matching node is not rendered
                const about = screen.getByText(pageName);

                expect(about.closest('.ant-tree-treenode')).toHaveAttribute(
                    'draggable',
                    'false'
                );
            }
        );

        test('parent page can not drop to any layer', async () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            slug: '/',
                            name: 'Home',
                            pageType: 'HOMEPAGE',
                        },
                        {
                            slug: 'contact',
                            name: 'Contact',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'About',
                            slug: 'about',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'Me',
                            slug: 'about/me',
                            pageType: 'REGULAR',
                        },
                    ],
                },
            });

            // Assert that the non-matching node is not rendered
            const draggableNode = screen.getByText('About');
            const dropTargetNode = screen.getByText('Contact');

            expect(dropTargetNode).toStrictEqual(
                screen.getByTestId('node-0-1')
            );

            await fireEvent.dragStart(draggableNode);
            await fireEvent.dragEnter(dropTargetNode);
            await fireEvent.dragOver(dropTargetNode);
            await fireEvent.drop(dropTargetNode);

            expect(dropTargetNode).toStrictEqual(
                screen.getByTestId('node-0-1')
            );
        });

        test('parent page should not render icon', async () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            name: 'About',
                            slug: 'about',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'Me',
                            slug: 'about/me',
                            pageType: 'REGULAR',
                        },
                    ],
                },
            });
            const parentPage = screen.getByText('About');
            const parentTreeNode = parentPage.closest('.ant-tree-treenode');

            const parentIcon = within(parentTreeNode).queryByTestId('file');
            expect(parentIcon).not.toBeInTheDocument();
        });

        test('page should render file icon', async () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            name: 'About',
                            slug: 'about',
                            pageType: 'REGULAR',
                        },
                    ],
                },
            });

            const parentIcon = screen.getByTestId('file');
            expect(parentIcon).toBeInTheDocument();
        });

        test('renders only the matching node when searching for a matching node', async () => {
            render(<PageTree search="Page 1" />, {
                shortContext: {
                    ...initialContextValues,
                },
            });

            // Assert that the non-matching node is not rendered
            expect(screen.getByText('Page 1')).toBeInTheDocument();
            expect(screen.queryByText('Page 2')).toBeNull();
            expect(screen.queryByText('Page 3')).toBeNull();
        });
    });

    describe('page settings dropdown', () => {
        const mockSave = vi.fn();
        const mockSetPages = vi.fn();

        describe('Set as homepage', () => {
            const mockSelectHomePage = vi.fn(() => [{ id: '121' }]);

            it(`should 'set as homepage' option be disabled for HOMEPAGE and show proper tooltip message`, async () => {
                const handleContextMenu = vi.fn();
                render(<PageTree handleContextMenu={handleContextMenu} />, {
                    shortContext: {
                        ...initialContextValues,
                        pages: [
                            {
                                name: 'Home',
                                slug: 'index',
                                pageType: 'HOMEPAGE',
                            },
                        ],
                    },
                });

                const home = screen.getByTestId('node-0-0');
                fireEvent.mouseOver(home);
                const setingsButton = screen.queryByTestId('setingsButton-0-0');
                fireEvent.click(setingsButton);
                await checkDisableAndToolTip({
                    name: 'Set As Homepage',
                    disabledState: 'true',
                    toolTipText: 'Already a Home page',
                });
            });

            it(`should 'set as homepage' option be disabled for CMS DRAFT PAGE  and show proper tooltip message`, async () => {
                const handleContextMenu = vi.fn();
                render(<PageTree handleContextMenu={handleContextMenu} />, {
                    shortContext: {
                        ...initialContextValues,
                        appName: 'CMS',
                        pages: [
                            {
                                name: 'En',
                                slug: 'en',
                                pageType: 'REGULAR',
                                status: 'DRAFT',
                            },
                        ],
                    },
                });

                const home = screen.getByTestId('node-0-0');
                fireEvent.mouseOver(home);
                const setingsButton = screen.queryByTestId('setingsButton-0-0');
                fireEvent.click(setingsButton);
                await checkDisableAndToolTip({
                    name: 'Set As Homepage',
                    disabledState: 'true',
                    toolTipText:
                        'Publish Status of the Page should be checked before making it as a HomePage',
                });
            });

            it(`should 'set as homepage' option be disabled when child pages exist  and show proper tooltip message`, async () => {
                const handleContextMenu = vi.fn();
                render(<PageTree handleContextMenu={handleContextMenu} />, {
                    shortContext: {
                        ...initialContextValues,
                        appName: 'CMS',
                        pages: [
                            {
                                name: 'En',
                                slug: 'en',
                                pageType: 'REGULAR',
                            },
                            {
                                name: 'About',
                                slug: 'en/about',
                                pageType: 'REGULAR',
                            },
                        ],
                    },
                });

                const home = screen.getByTestId('node-0-0');
                fireEvent.mouseOver(home);
                const setingsButton = screen.queryByTestId('setingsButton-0-0');
                fireEvent.click(setingsButton);
                await checkDisableAndToolTip({
                    name: 'Set As Homepage',
                    disabledState: 'true',
                    toolTipText: 'Must not have any child pages',
                });
            });

            it(`should a confirm modal be rendered on clicking 'set as homepage' option and both ok and cancel handlers work properly`, async () => {
                const handleContextMenu = vi.fn();
                render(<PageTree handleContextMenu={handleContextMenu} />, {
                    shortContext: {
                        ...initialContextValues,
                        setPages: mockSetPages,
                        selectHomePage: mockSelectHomePage,
                        pages: [
                            {
                                name: 'En',
                                slug: 'en',
                                pageType: 'REGULAR',
                            },
                        ],
                    },
                });

                const home = screen.getByTestId('node-0-0');
                fireEvent.mouseOver(home);
                const setingsButton = screen.queryByTestId('setingsButton-0-0');
                fireEvent.click(setingsButton);
                const setAsHomePageOption = await checkDisableAndToolTip({
                    name: 'Set As Homepage',
                    disabledState: 'false',
                });
                fireEvent.click(setAsHomePageOption);
                expect(
                    screen.getByText('Are you sure to switch Home page?')
                ).toBeInTheDocument();
                fireEvent.click(
                    screen.getByRole('button', {
                        name: `Yes`,
                    })
                );
                expect(mockSelectHomePage).toHaveBeenCalledWith({
                    name: 'En',
                    slug: 'en',
                    pageType: 'REGULAR',
                    pageIndex: 0,
                });
                //testing if the loading indicator runs for yes button and the modal is still visible
                expect(
                    screen.getByRole('button', {
                        name: `loading Yes`,
                    })
                ).toBeInTheDocument();
                expect(
                    screen.getByText('Are you sure to switch Home page?')
                ).toBeInTheDocument();
                fireEvent.click(
                    screen.getByRole('button', {
                        name: `No`,
                    })
                );
            });

            it(`should the ok handler of confirm modal resolves properly`, async () => {
                const handleContextMenu = vi.fn();
                render(<PageTree handleContextMenu={handleContextMenu} />, {
                    shortContext: {
                        ...initialContextValues,
                        setPages: mockSetPages,
                        selectHomePage: mockSelectHomePage,
                        pages: [
                            {
                                name: 'En',
                                slug: 'en',
                                pageType: 'REGULAR',
                            },
                        ],
                    },
                });

                // const home = screen.getByTestId('node-0-0');

                await userEvent.hover(screen.getByTestId('node-0-0'));
                const setingsButton = screen.queryByTestId('setingsButton-0-0');
                await userEvent.click(setingsButton);
                const setAsHomePageOption = await checkDisableAndToolTip({
                    name: 'Set As Homepage',
                });
                userEvent.click(setAsHomePageOption);
                await waitFor(() => {
                    expect(
                        screen.getByText('Are you sure to switch Home page?')
                    ).toBeInTheDocument();
                });
                await userEvent.click(
                    screen.getByRole('button', {
                        name: `Yes`,
                    })
                );
                expect(mockSelectHomePage).toHaveBeenCalledWith({
                    name: 'En',
                    slug: 'en',
                    pageType: 'REGULAR',
                    pageIndex: 0,
                });

                //testing if the promise returned by the onOk handler of confirm modal resolves with necessary functionality being done
                await waitFor(() => {
                    expect(mockSetPages).toHaveBeenCalledWith({
                        pages: [{ id: '121' }],
                        activePageIndex: 0,
                    });
                });

                expect(mockSelectPage).toHaveBeenCalledWith({
                    name: 'En',
                    slug: 'en',
                    pageIndex: 0,
                    pageType: 'REGULAR',
                });
            });

            describe('Add page', () => {
                it(`should 'add page' option be disabled for HOMEPAGE and show proper tooltip message`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            pages: [
                                {
                                    name: 'Home',
                                    slug: 'index',
                                    pageType: 'HOMEPAGE',
                                },
                            ],
                        },
                    });
                    const home = screen.getByTestId('node-0-0');
                    fireEvent.mouseOver(home);
                    const setingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    fireEvent.click(setingsButton);
                    await checkDisableAndToolTip({
                        name: 'Add Nested Page',
                        disabledState: 'true',
                        toolTipText: 'Home page can not have a child page',
                    });
                });

                it(`should 'add page' option be enabled for a page which is not a hopmepage and new page be saved with static specific data`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            save: mockSave,
                            pages: [
                                {
                                    name: 'About',
                                    slug: 'about',
                                    pageType: 'REGULAR',
                                },
                            ],
                        },
                    });

                    const home = screen.getByTestId('node-0-0');
                    fireEvent.mouseOver(home);
                    const setingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    fireEvent.click(setingsButton);
                    const addPagePageOption = await checkDisableAndToolTip({
                        name: 'Add Nested Page',
                        disabledState: 'false',
                    });
                    fireEvent.click(addPagePageOption);
                    expect(nanoid).toHaveBeenCalledWith(6);
                    expect(mockSave).toHaveBeenCalledWith(
                        {
                            pages: [
                                {
                                    name: 'Untitled',
                                    slug: 'about/randomId',
                                    pageType: 'REGULAR',
                                    data: JSON.stringify({ content: [] }),
                                },
                            ],
                        },
                        { isNotify: true, isPageSave: true }
                    );
                });
                it(`should 'add page' be saved with cms specific data`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            save: mockSave,
                            appName: 'CMS',
                            pages: [
                                {
                                    name: 'About',
                                    slug: 'about',
                                    pageType: 'REGULAR',
                                },
                            ],
                        },
                    });

                    const home = screen.getByTestId('node-0-0');
                    fireEvent.mouseOver(home);
                    const setingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    fireEvent.click(setingsButton);
                    const addPagePageOption = await checkDisableAndToolTip({
                        name: 'Add Nested Page',
                        disabledState: 'false',
                    });
                    fireEvent.click(addPagePageOption);
                    expect(nanoid).toHaveBeenCalledWith(6);
                    expect(mockSave).toHaveBeenCalledWith(
                        {
                            pages: [
                                {
                                    name: 'Untitled',
                                    slug: 'about/randomId',
                                    pageType: 'REGULAR',
                                    data: JSON.stringify({ content: [] }),
                                    isPasswordEnable: false,
                                    status: 'PUBLISHED',
                                },
                            ],
                        },
                        { isNotify: true, isPageSave: true }
                    );
                });
            });

            describe('Change name and slug', () => {
                it(`should 'chnage slug' option be disabled for HOMEPAGE and show proper tooltip message`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            pages: [
                                {
                                    name: 'Home',
                                    slug: 'index',
                                    pageType: 'HOMEPAGE',
                                },
                            ],
                        },
                    });
                    const home = screen.getByTestId('node-0-0');
                    fireEvent.mouseOver(home);
                    const setingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    fireEvent.click(setingsButton);
                    await checkDisableAndToolTip({
                        name: 'Update Slug & Name',
                        disabledState: 'true',
                        toolTipText:
                            'Name and slug can not be changed for Home page',
                    });
                });

                it(`should 'change slug' option be enabled for a page which is not a homepage and also opens the modal form with initial values`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            save: mockSave,
                            pages: [
                                {
                                    name: 'About',
                                    slug: 'about',
                                    pageType: 'REGULAR',
                                },
                                {
                                    name: 'English',
                                    slug: 'about/en',
                                    pageType: 'REGULAR',
                                },
                                {
                                    name: 'Oxford',
                                    slug: 'about/en/oxford',
                                    pageType: 'REGULAR',
                                },
                            ],
                        },
                    });
                    const about = screen.getByTestId('node-0-0');
                    fireEvent.mouseOver(about);
                    const setingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    fireEvent.click(setingsButton);
                    const changeSlugOption = await checkDisableAndToolTip({
                        name: 'Update Slug & Name',
                        disabledState: 'false',
                    });
                    fireEvent.click(changeSlugOption);
                    //testing the initial modal visual
                    expect(
                        screen.getByText('Page name and slug')
                    ).toBeInTheDocument();
                    expect(
                        screen.getByRole('textbox', { name: /page name/i })
                            .value
                    ).toBe('About');
                    expect(
                        screen.getByRole('textbox', { name: /page slug/i })
                            .value
                    ).toBe('about');
                });

                it(`should 'change slug' option be enabled for a child page and also opens the modal form with initial values`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            editPageIndex: 2,
                            save: mockSave,
                            pages: [
                                {
                                    name: 'About',
                                    slug: 'about',
                                    pageType: 'REGULAR',
                                },
                                {
                                    name: 'En',
                                    slug: 'about/en',
                                    pageType: 'REGULAR',
                                },
                                {
                                    name: 'Oxford',
                                    slug: 'about/en/oxford',
                                    pageType: 'REGULAR',
                                },
                                {
                                    name: 'version1',
                                    slug: 'about/en/oxford/version1',
                                    pageType: 'REGULAR',
                                },
                                {
                                    name: 'version1.1',
                                    slug: 'about/en/oxford/version1/version1-1',
                                    pageType: 'REGULAR',
                                },
                            ],
                        },
                    });
                    fireEvent.mouseOver(screen.getByTestId('node-0-0-0-0'));
                    const setingsButton = screen.queryByTestId(
                        'setingsButton-0-0-0-0'
                    );
                    fireEvent.click(setingsButton);
                    const changeSlugOption = await checkDisableAndToolTip({
                        name: 'Update Slug & Name',
                        disabledState: 'false',
                    });
                    fireEvent.click(changeSlugOption);
                    //testing the initial modal visual
                    expect(
                        screen.getByText('Page name and slug')
                    ).toBeInTheDocument();
                    expect(
                        screen.getByRole('textbox', { name: /page name/i })
                            .value
                    ).toBe('Oxford');
                    expect(
                        screen.getByRole('textbox', { name: /page slug/i })
                            .value
                    ).toBe('oxford');
                });
            });
            describe('Duplicate page', () => {
                it(`should 'duplicate page' option be enabled for non home page and new page be saved with specific data`, async () => {
                    const targetPage = {
                        id: '12121',
                        name: 'About',
                        slug: 'about',
                        pageType: 'REGULAR',
                        data: {
                            content: [
                                {
                                    section: {
                                        content: [],
                                    },
                                },
                            ],
                        },
                        status: 'PUBLISHED',
                    };
                    mockAsyncGetPageDataById.mockReturnValue(targetPage.data);
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            save: mockSave,
                            pages: [targetPage],
                        },
                    });
                    const about = screen.getByTestId('node-0-0');
                    await userEvent.hover(about);
                    const aboutSetingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    await userEvent.click(aboutSetingsButton);
                    const aboutDuplicatePageOption =
                        await checkDisableAndToolTip({
                            name: 'Duplicate Page',
                            disabledState: 'false',
                        });
                    expect(aboutDuplicatePageOption).toBeInTheDocument();
                    await userEvent.click(aboutDuplicatePageOption);
                    expect(mockAsyncGetPageDataById).toHaveBeenCalledWith(
                        '12121'
                    );
                    expect(nanoid).toHaveBeenCalledWith(6);
                    expect(mockSave).toHaveBeenCalledWith(
                        {
                            pages: [
                                {
                                    name: 'About Copy',
                                    slug: 'about-randomId',
                                    pageType: 'REGULAR',
                                    data: targetPage.data,
                                    status: 'PUBLISHED',
                                },
                            ],
                        },
                        { isNotify: true, isPageSave: true }
                    );
                });

                it(`should 'duplicate page' option be enabled for Home page and new page be saved with specific data`, async () => {
                    const targetPage = {
                        id: '12121',
                        name: 'Home',
                        slug: 'INDEX',
                        pageType: 'HOMEPAGE',
                        data: {
                            content: [
                                {
                                    section: {
                                        content: [],
                                    },
                                },
                            ],
                        },
                        status: 'PUBLISHED',
                    };
                    mockAsyncGetPageDataById.mockReturnValue(targetPage.data);
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            save: mockSave,
                            pages: [targetPage],
                        },
                    });

                    const home = screen.getByTestId('node-0-0');
                    await userEvent.hover(home);
                    const homeSetingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    await userEvent.click(homeSetingsButton);
                    const homeDuplicatePageOption =
                        await checkDisableAndToolTip({
                            name: 'Duplicate Page',
                            disabledState: 'false',
                        });
                    expect(homeDuplicatePageOption).toBeInTheDocument();
                    await userEvent.click(homeDuplicatePageOption);
                    expect(nanoid).toHaveBeenCalledWith(6);
                    expect(mockAsyncGetPageDataById).toHaveBeenCalledWith(
                        '12121'
                    );
                    expect(mockSave).toHaveBeenCalledWith(
                        {
                            pages: [
                                {
                                    name: 'Home Copy',
                                    slug: 'INDEX-randomId',
                                    pageType: 'REGULAR',
                                    data: targetPage.data,
                                    status: 'PUBLISHED',
                                },
                            ],
                        },
                        { isNotify: true, isPageSave: true }
                    );
                });
            });

            describe('Toggle status', () => {
                it(`should 'publish status' option not be rendered for static site`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            save: mockSave,
                            appName: 'STATIC',
                            pages: [
                                {
                                    name: 'About',
                                    slug: 'about',
                                    pageType: 'REGULAR',
                                },
                            ],
                        },
                    });

                    const about = screen.getByTestId('node-0-0');
                    await userEvent.hover(about);
                    const aboutSetingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    await userEvent.click(aboutSetingsButton);
                    expect(
                        screen.queryByRole('menuitem', {
                            name: /published/i,
                        })
                    ).not.toBeInTheDocument();
                });

                it.each([
                    { status: 'PUBLISHED', changedStatus: 'DRAFT' },
                    { status: 'DRAFT', changedStatus: 'PUBLISHED' },
                ])(
                    `should 'publish status' option be rendered for cms site and toggling actions work appropriately for  already $status page`,
                    async ({ status, changedStatus }) => {
                        const handleContextMenu = vi.fn();
                        render(
                            <PageTree handleContextMenu={handleContextMenu} />,
                            {
                                shortContext: {
                                    ...initialContextValues,
                                    save: mockSave,
                                    appName: 'CMS',
                                    pages: [
                                        {
                                            name: 'About',
                                            slug: 'about',
                                            pageType: 'REGULAR',
                                            status,
                                        },
                                    ],
                                },
                            }
                        );

                        const about = screen.getByTestId('node-0-0');
                        fireEvent.mouseOver(about);
                        const aboutSetingsButton =
                            screen.queryByTestId('setingsButton-0-0');
                        fireEvent.click(aboutSetingsButton);
                        expect(
                            screen.getByRole('menuitem', {
                                name: /published/i,
                            })
                        ).toBeInTheDocument();
                        const switchButton = within(
                            screen.getByRole('menuitem', {
                                name: /published/i,
                            })
                        ).getByRole('switch');
                        expect(switchButton).toHaveAttribute(
                            'aria-checked',
                            `${status === 'PUBLISHED' ? 'true' : 'false'}`
                        );
                        fireEvent.click(switchButton);
                        expect(
                            screen.getByText(
                                `Are you sure to switch page status to ${changedStatus}?`
                            )
                        ).toBeInTheDocument();
                        fireEvent.click(
                            screen.getByRole('button', {
                                name: `Yes`,
                            })
                        );
                        expect(mockSave).toHaveBeenCalledWith(
                            {
                                pages: [
                                    {
                                        name: 'About',
                                        slug: 'about',
                                        pageType: 'REGULAR',
                                        status: changedStatus,
                                    },
                                ],
                            },
                            { isNotify: true, isPageSave: true }
                        );
                    }
                );

                it.each([
                    {
                        isModified: true,
                        data: { content: [{ section: { content: [] } }] },
                    },
                    {
                        isModified: false,
                        data: { content: [{ section: { content: [] } }] },
                    },
                ])(
                    `should page data be saved correctly while changing status`,
                    async ({ isModified, data }) => {
                        const handleContextMenu = vi.fn();
                        render(
                            <PageTree handleContextMenu={handleContextMenu} />,
                            {
                                shortContext: {
                                    ...initialContextValues,
                                    save: mockSave,
                                    appName: 'CMS',
                                    pages: [
                                        {
                                            name: 'About',
                                            slug: 'about',
                                            isModified,
                                            data,
                                            pageType: 'REGULAR',
                                        },
                                    ],
                                },
                            }
                        );
                        await userEvent.hover(screen.getByTestId('node-0-0'));
                        await userEvent.click(
                            screen.queryByTestId('setingsButton-0-0')
                        );
                        const switchButton = within(
                            await screen.findByRole('menuitem', {
                                name: /published/i,
                            })
                        ).getByRole('switch');
                        await userEvent.click(switchButton);
                        await userEvent.click(
                            screen.getByRole('button', {
                                name: `Yes`,
                            })
                        );
                        expect(mockSave).toHaveBeenCalledWith(
                            {
                                pages: [
                                    expect.objectContaining({
                                        data: isModified
                                            ? JSON.stringify(data)
                                            : undefined,
                                    }),
                                ],
                            },
                            { isNotify: true, isPageSave: true }
                        );
                    }
                );
            });

            describe('Delete page', () => {
                const mockRemovePAge = vi.fn();
                it(`should 'Delete page' option be disabled for home page with proper tooltip text`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            removePage: mockRemovePAge,
                            pages: [
                                {
                                    name: 'Home',
                                    slug: 'index',
                                    pageType: 'HOMEPAGE',
                                },
                            ],
                        },
                    });
                    const home = screen.getByTestId('node-0-0');
                    await userEvent.hover(home);
                    const homeSetingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    await userEvent.click(homeSetingsButton);
                    await checkDisableAndToolTip({
                        name: 'Delete Page',
                        disabledState: 'true',
                        toolTipText: 'Home page can not be deleted',
                    });
                });

                it(`should 'Delete page' option be disabled for parent page with proper tooltip text`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            removePage: mockRemovePAge,
                            pages: [
                                {
                                    name: 'About',
                                    slug: 'about',
                                    pageType: 'REGULAR',
                                },
                                {
                                    name: 'english',
                                    slug: 'about/em',
                                    pageType: 'REGULAR',
                                },
                            ],
                        },
                    });
                    const page = screen.getByTestId('node-0-0');
                    await userEvent.hover(page);
                    const setingsButton =
                        screen.queryByTestId('setingsButton-0-0');
                    await userEvent.click(setingsButton);
                    await checkDisableAndToolTip({
                        name: 'Delete Page',
                        disabledState: 'true',
                        toolTipText: 'Must not have any child pages',
                    });
                });

                it(`should 'Delete page' handler works properly`, async () => {
                    const handleContextMenu = vi.fn();
                    render(<PageTree handleContextMenu={handleContextMenu} />, {
                        shortContext: {
                            ...initialContextValues,
                            removePage: mockRemovePAge,
                            editPageIndex: 1,
                            pages: [
                                {
                                    name: 'Home',
                                    slug: 'index',
                                    pageType: 'HOMEPAGE',
                                },
                                {
                                    id: '121',
                                    name: 'english',
                                    slug: 'about',
                                    pageType: 'REGULAR',
                                },
                            ],
                        },
                    });
                    const page = screen.getByTestId('node-0-1');
                    await userEvent.hover(page);
                    const SetingsButton =
                        screen.queryByTestId('setingsButton-0-1');
                    await userEvent.click(SetingsButton);
                    const deletePageOption = await checkDisableAndToolTip({
                        name: 'Delete Page',
                        disabledState: 'false',
                    });
                    await userEvent.click(deletePageOption);
                    expect(
                        screen.getByText(
                            `Are you sure you want to remove this page?`
                        )
                    ).toBeInTheDocument();
                    await userEvent.click(
                        screen.getByRole('button', {
                            name: `Yes`,
                        })
                    );
                    expect(mockRemovePAge).toHaveBeenCalledWith(
                        expect.objectContaining({
                            id: '121',
                            editPageIndex: 1,
                            index: 1,
                        })
                    );
                });
            });
        });

        test('should homePage render at the first position in the page tree', async () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            slug: 'index',
                            name: 'Home Alt',
                            pageType: 'REGULAR',
                        },
                        {
                            slug: 'contact',
                            name: 'Contact',
                            pageType: 'REGULAR',
                        },
                        {
                            slug: 'en',
                            name: 'En',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'About',
                            slug: 'en/about',
                            pageType: 'REGULAR',
                        },
                        {
                            slug: '/',
                            name: 'Home',
                            pageType: 'HOMEPAGE',
                        },
                    ],
                },
            });
            // Assert that the non-matching node is not rendered
            const homePage = screen.getByTestId('node-0-0');
            expect(homePage).toHaveTextContent('Home');
        });

        test('should render pages without slug without drag and drop functionality', async () => {
            render(<PageTree />, {
                shortContext: {
                    ...initialContextValues,
                    pages: [
                        {
                            slug: 'index',
                            name: 'Home Alt',
                            pageType: 'REGULAR',
                        },
                        {
                            slug: 'contact',
                            name: 'Contact',
                            pageType: 'REGULAR',
                        },
                        {
                            slug: 'en',
                            name: 'En',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'About',
                            slug: 'en/about',
                            pageType: 'REGULAR',
                        },
                        {
                            slug: '/',
                            name: 'Home',
                            pageType: 'HOMEPAGE',
                        },
                        {
                            slug: '',
                            name: 'Empty Slug 1',
                            pageType: 'REGULAR',
                        },
                        {
                            slug: null,
                            name: 'Empty Slug 2',
                            pageType: 'REGULAR',
                        },
                        {
                            name: 'Empty Slug 3',
                            pageType: 'REGULAR',
                        },
                    ],
                },
            });
            const emptySlug1 = screen.getByText('Empty Slug 1');
            const emptySlug2 = screen.getByText('Empty Slug 2');

            expect(emptySlug1).toBeInTheDocument();
            expect(emptySlug1.closest('.ant-tree-treenode')).toHaveAttribute(
                'draggable',
                'false'
            );

            expect(emptySlug2).toBeInTheDocument();
            expect(emptySlug2.closest('.ant-tree-treenode')).toHaveAttribute(
                'draggable',
                'false'
            );
        });
    });

    it(`should activeDropDown style work properly`, async () => {
        const handleContextMenu = vi.fn();
        render(<PageTree handleContextMenu={handleContextMenu} />, {
            ...initialContextValues,
            editPageIndex: 0,
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
                    name: 'English',
                    slug: 'about/en',
                    pageType: 'REGULAR',
                },
            ],
        });
        const home = screen.getByTestId('node-0-0');
        await userEvent.hover(home);
        const homeSetingsButton = screen.queryByTestId('setingsButton-0-0');
        await userEvent.click(homeSetingsButton);
        //current editPage should not be selected
        expect(
            home.closest('.ant-tree-treenode-selected')
        ).not.toBeInTheDocument();
        expect(home.closest('.activeDropDown')).toBeInTheDocument();
        await userEvent.click(home);
        expect(home.closest('.activeDropDown')).not.toBeInTheDocument();

        //couldn't test the bg color of the  pseudo after
        // const afterStyles = getComputedStyle(
        //     home.closest('.ant-tree-treenode.activeDropDown'),
        //     '::after'
        // );
        // expect(afterStyles.getPropertyValue('background-color')).toBe(
        //     '#f4f6f9'
        // );
    });

    it(`should not render settings button on hover for a unknown legacy parent page`, async () => {
        const handleContextMenu = vi.fn();
        render(<PageTree handleContextMenu={handleContextMenu} />, {
            shortContext: {
                ...initialContextValues,
                pages: [
                    {
                        name: 'English',
                        slug: 'about/en',
                        pageType: 'REGULAR',
                    },
                ],
            },
        });
        const unkonwn = screen.getByTestId('node-0-0');
        await userEvent.hover(unkonwn);

        const unkonwnSetingsButton = screen.queryByTestId('setingsButton-0-0');
        expect(unkonwnSetingsButton).not.toBeInTheDocument();
    });
});

async function checkDisableAndToolTip({ name, disabledState, toolTipText }) {
    const option = screen.getByRole('menuitem', {
        name,
    });
    expect(option).toHaveAttribute('aria-disabled', disabledState);
    fireEvent.mouseOver(within(option).getByTestId('menuItem'));
    if (toolTipText) {
        expect(
            await screen.findByRole('tooltip', {
                name: toolTipText,
            })
        ).toBeInTheDocument();
    }
    return option;
}

const dragAndDrop = async ({ draggableElement, droppableArea }) => {
    fireEvent.dragStart(draggableElement);
    fireEvent.dragEnter(droppableArea);
    fireEvent.dragOver(droppableArea);
    fireEvent.drop(droppableArea);
};
