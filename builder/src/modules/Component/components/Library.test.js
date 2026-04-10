// after fixing the actual issue this eslint disabled related code will be removed
/* eslint-disable testing-library/no-promise-in-fire-event */
/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/await-async-query */
/*****************************************************
 * Packages
 ******************************************************/
/*****************************************************
 * Locals
 ******************************************************/
import RecursiveRender from '@/components/RecursiveRender';
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from '@/util/test-utils.js';
import { CMSContext } from '@dorik/html-parser';
import { Drawer } from 'modules/Drawer';
import { getByCustomSelector, queryAllByClassName } from 'util/custom-queries';
import { getDnDConfig, handleCanDrop } from 'util/dndHelpers';
import pageWithContainer from '../../../components/__mocks__/recursive-render/page-with-container.json';
import {
    mockLibData,
    mockSavedColumns,
    mockSavedContainers,
    mockSavedElements,
    mockSavedRows,
    mockSavedSections,
    mockSymbols,
} from '../__mocks__/mockLibrary';
import { getFormattedLibraryData } from '../utils';
import Library from './Library';
import { generateDataWithParentElements } from 'modules/Shared/util/generateDataWithParentElements';

const mockGetVisibleElements = vi.fn(() => []);
const mockGetElements = vi.fn(() => []);
const mockGetSavedElements = vi.fn(() => []);
const mockOnDragItem = vi.fn();
const mockAddElement = vi.fn();
const mockGetElement = vi.fn(async () => {
    return JSON.stringify({
        name: 'Section',
        id: '0kbhijyz',
        type: 'section',
        _elType: 'SECTION',
        component_path: 'section',
    });
});
const mockRemoveElement = vi.fn(async () => {
    return true;
});

const mockSavedElementsData = {
    SECTION: mockSavedSections,
    ROW: mockSavedRows,
    COLUMN: mockSavedColumns,
    ELEMENT: mockSavedElements,
    CONTAINER: mockSavedContainers,
};

const initialContexts = {
    versionHistory: {},
    elementControls: {},
    currentEditAddress: () => {},
    addElement: mockAddElement,
    getElement: mockGetElement,
    getVisibleElements: mockGetVisibleElements,
    getElements: mockGetElements,
    getSavedElements: mockGetSavedElements,
    removeElement: mockRemoveElement,
    isWhiteLabelEnabled: false,
    display: '',
    currentEditItem: {},
    isFetching: false,
    contextState: {},
    symbols: mockSymbols,
    getDataByAddress: () => ({}),
};

vi.stubGlobal(
    'IntersectionObserver',
    vi.fn().mockImplementation(() => ({
        observe: () => null,
    }))
);

Math.hypot = () => 30;
vi.spyOn(Math, 'hypot');

const Component = (props) => (
    <CMSContext.Provider
        value={{
            useCollectionItems: () => ({
                data: Array.from({ length: 5 }, () => ({})),
            }),
        }}
    >
        <Library {...props} />
    </CMSContext.Provider>
);

beforeEach(() => {
    vi.clearAllMocks();
});

vi.mock('../../../util/uniqId', () => ({
    default: vi.fn(() => '123'),
}));

describe('Library', () => {
    it('should render modal title in the document', () => {
        render(<Component />, {
            shortContext: { ...initialContexts },
        });

        const modalTitle = screen.getByText('Components');

        expect(modalTitle).toBeInTheDocument();
    });

    it('should render radio buttons correctly', async () => {
        render(<Component />, {
            shortContext: { ...initialContexts },
        });

        const options = screen.getAllByRole('radio', {
            name: /library|saved|symbols/i,
        });

        expect(options.length).toBe(3);
    });

    describe('Section Library', () => {
        const expectedFormattedData = getFormattedLibraryData(mockLibData);

        describe.each(expectedFormattedData)(
            '### Tag: $title ###',
            ({ title, components }) => {
                beforeEach(() => {
                    mockGetVisibleElements.mockReturnValue(mockLibData);
                });

                it(`should expand and collapse work properly for tag>> '${title}' by rendering correct number of components`, () => {
                    render(<Component />, {
                        shortContext: { ...initialContexts },
                    });
                    switchToTab('Library');

                    checkExpandCollapseWithComponentsLength({
                        title,
                        expectedComponents: components,
                        cacheKey: 'providedSections',
                    });
                });

                describe.each(components)(
                    `component-$id`,
                    ({ thumbnail, id, title: name }) => {
                        it(`should render image under tag>${title} have correct thumbnail of ${
                            thumbnail || '/assets/images/image-placeholder.jpg'
                        }  list view ${
                            thumbnail ? 'and preview' : 'only'
                        }`, async () => {
                            render(<Component />, {
                                shortContext: { ...initialContexts },
                            });
                            switchToTab('Library');
                            const button = screen.getByRole('button', {
                                name: title,
                            });
                            fireEvent.click(button);
                            await checkThumbNailAndPreview({
                                thumbnail,
                                name,
                                id,
                            });
                        });

                        it.each([
                            {
                                type: 'section',
                                address: '0',
                                parentType: 'page',
                                testId: 'section-0',
                            },
                            {
                                type: 'row',
                                address: '0.0',
                                parentType: 'section',
                                testId: 'row-0.0',
                            },
                            {
                                type: 'column',
                                address: '0.0.0',
                                parentType: 'row',
                                testId: 'column-0.0.0',
                            },
                            {
                                type: 'component',
                                address: '0.0.0.0',
                                parentType: 'column',
                                testId: 'heading-0.0.0.0',
                            },
                            {
                                type: 'container',
                                address: '1.0',
                                parentType: 'section',
                                testId: 'container-1.0',
                            },
                            {
                                type: 'container',
                                address: '1.0.0',
                                parentType: 'container',
                                testId: 'container-1.0.0',
                            },
                            {
                                type: 'component',
                                address: '1.0.0.0.0',
                                parentType: 'container',
                                testId: 'accordion-1.0.0.0.0',
                            },
                        ])(
                            'should dnd logic work when moving from the components drawer into the page over type: $type ',
                            async (dropOverElement) => {
                                const { type, address, parentType, testId } =
                                    dropOverElement;
                                render(
                                    <>
                                        <Component />
                                        <RecursiveRender
                                            type="page"
                                            page={{}}
                                            content={pageWithContainer.content}
                                            onDragItem={mockOnDragItem}
                                            siteId="xyz"
                                        />
                                    </>,
                                    {
                                        shortContext: { ...initialContexts },
                                    }
                                );
                                switchToTab('Library');
                                const button = screen.getByRole('button', {
                                    name: title,
                                });
                                fireEvent.click(button);
                                const draggableElement = screen.getByTestId(
                                    `card-${id}`
                                );
                                // should not drop as a sibling of a row
                                let droppableArea = screen.getByTestId(testId);
                                dragAndDrop({
                                    draggableElement,
                                    droppableArea,
                                });

                                await waitFor(() => {
                                    expect(mockAddElement).toHaveBeenCalledWith(
                                        {
                                            elType: 'SECTION',
                                            addElType: 'SECTION',
                                            type: 'section',
                                            data: {
                                                name: 'Section',
                                                id: '0kbhijyz',
                                                type: 'section',
                                                _elType: 'SECTION',
                                                component_path: 'section',
                                            },
                                            insertAddress: `${
                                                address.split('.')[0] - 1
                                            }`,
                                        }
                                    );
                                });
                            }
                        );

                        it(`should render custom drag preview with thumbnail: ${
                            thumbnail || '/assets/images/image-placeholder.jpg'
                        } and tag:${title}`, async () => {
                            render(
                                <Drawer
                                    isOpen="true"
                                    drawerName="components"
                                />,
                                {
                                    shortContext: { ...initialContexts },
                                }
                            );
                            switchToTab('Library');
                            const button = screen.getByRole('button', {
                                name: title,
                            });
                            fireEvent.click(button);
                            await checkCustomDragPreview({
                                id,
                                thumbnail:
                                    thumbnail ||
                                    '/assets/images/image-placeholder.jpg',
                                componentType: title,
                                name,
                            });
                        });
                    }
                );
            }
        );

        it('should not refetch after switching tab and  coming back to library again ', async () => {
            render(<Component />, {
                shortContext: { ...initialContexts },
            });
            fireEvent.click(
                screen.getByRole('radio', {
                    name: 'Library',
                })
            );
            //testing if  fetching on the initial render
            await waitFor(() => {
                expect(mockGetElements).toHaveBeenCalledWith(
                    'SECTION',
                    'providedSections'
                );
            });

            //testing if  not fetching after switching
            mockGetElements.mockReset();
            fireEvent.click(
                screen.getByRole('radio', {
                    name: 'Saved',
                })
            );
            fireEvent.click(
                screen.getByRole('radio', {
                    name: 'Library',
                })
            );
            await waitFor(() => {
                expect(mockGetElements).not.toHaveBeenCalledWith(
                    'SECTION',
                    'providedSections'
                );
            });
        });
    });

    describe('Saved Elements', () => {
        const elementsInfo = [
            { type: 'SECTION', cacheKey: 'savedSections' },
            { type: 'ROW', cacheKey: 'savedRows' },
            { type: 'COLUMN', cacheKey: 'savedColumns' },
            { type: 'ELEMENT', cacheKey: 'savedElements' },
            { type: 'CONTAINER', cacheKey: 'savedContainers' },
        ];

        describe.each(elementsInfo)(
            '### Tag: $type ###',
            ({ type: title, cacheKey }) => {
                const elementTypeSpecificData = mockSavedElementsData[title];
                beforeEach(() => {
                    mockGetVisibleElements.mockReturnValue(
                        elementTypeSpecificData
                    );
                });

                const propagatesDroppingOver = {
                    SECTION: ['component', 'column', 'row', 'container'],
                    ROW: ['component', 'column', 'container'],
                    COLUMN: ['component'],
                    ELEMENT: ['container'],
                    CONTAINER: [],
                }[title];

                it(`should expand and collapse work properly for tag>> '${title}' by rendering correct number of components`, async () => {
                    render(<Component />, {
                        shortContext: { ...initialContexts },
                    });

                    switchToTab('Saved');

                    await checkExpandCollapseWithComponentsLength({
                        title,
                        expectedComponents: elementTypeSpecificData,
                        cacheKey,
                    });
                });

                describe.each(elementTypeSpecificData)(
                    `component-$id`,
                    ({
                        thumbnail,
                        id,
                        type: componentType,
                        data,
                        title: name,
                    }) => {
                        it(`should render image under tag>${title}  ${id} have correct thumbnail of ${
                            thumbnail || '/assets/images/image-placeholder.jpg'
                        } on list view ${
                            thumbnail ? 'and preview' : 'only'
                        }`, async () => {
                            render(<Component />, {
                                shortContext: { ...initialContexts },
                            });
                            switchToTab('Saved');
                            const button = screen.getByRole('button', {
                                name: title,
                            });
                            fireEvent.click(button);
                            await checkThumbNailAndPreview({
                                thumbnail,
                                name,
                                id,
                            });
                        });

                        it(`should render custom drag preview with thumbnail: ${
                            thumbnail || '/assets/images/image-placeholder.jpg'
                        } and tag:${title}`, async () => {
                            render(
                                <Drawer
                                    isOpen="true"
                                    drawerName="components"
                                />,
                                {
                                    shortContext: { ...initialContexts },
                                }
                            );
                            switchToTab('Saved');
                            const button = screen.getByRole('button', {
                                name: title,
                            });
                            await fireEvent.click(button);
                            await checkCustomDragPreview({
                                id,
                                thumbnail:
                                    thumbnail ||
                                    '/assets/images/image-placeholder.jpg',
                                componentType,
                                name,
                            });
                        });

                        it(`should render delete button on hover  under tag>${title}  ${id} and it functions correctly on click`, async () => {
                            render(<Library />, {
                                shortContext: { ...initialContexts },
                            });
                            switchToTab('Saved');
                            const button = screen.getByRole('button', {
                                name: title,
                            });
                            fireEvent.click(button);
                            const card = screen.getByTestId(`card-${id}`);
                            fireEvent.mouseOver(card);
                            const deleteButton = getByCustomSelector('.remove');
                            expect(deleteButton).toBeInTheDocument();
                            fireEvent.click(deleteButton);
                            expect(
                                screen.getByText(`Remove the ${title}`)
                            ).toBeInTheDocument();
                            mockGetSavedElements.mockRestore();
                            fireEvent.click(
                                screen.getByRole('button', { name: 'Yes' })
                            );
                            expect(mockRemoveElement).toHaveBeenCalledWith(
                                id,
                                title
                            );
                            await waitFor(() => {
                                expect(
                                    mockGetSavedElements
                                ).toHaveBeenCalledWith(title, cacheKey);
                            });
                        });

                        it.each([
                            {
                                type: 'section',
                                address: '0',
                                parentType: 'page',
                                testId: 'section-0',
                            },
                            {
                                type: 'row',
                                address: '0.0',
                                parentType: 'section',
                                testId: 'row-0.0',
                            },
                            {
                                type: 'column',
                                address: '0.0.0',
                                parentType: 'row',
                                testId: 'column-0.0.0',
                            },
                            {
                                type: 'component',
                                address: '0.0.0.0',
                                parentType: 'column',
                                testId: 'heading-0.0.0.0',
                            },
                            {
                                type: 'container',
                                address: '1.0',
                                parentType: 'section',
                                testId: 'container-1.0',
                            },
                            {
                                type: 'container',
                                address: '1.0.0',
                                parentType: 'container',
                                testId: 'container-1.0.0',
                            },
                            {
                                type: 'component',
                                address: '1.0.0.0.0',
                                parentType: 'container',
                                testId: 'accordion-1.0.0.0.0',
                            },
                        ])(
                            'should dnd logic work when moving from the components drawer into the page over type: $type parentType:$parentType',
                            async (overItem) => {
                                const { type, address, parentType, testId } =
                                    overItem;
                                render(
                                    <>
                                        <Component />
                                        <RecursiveRender
                                            type="page"
                                            page={{}}
                                            content={pageWithContainer.content}
                                            onDragItem={mockOnDragItem}
                                            siteId="xyz"
                                        />
                                    </>,
                                    {
                                        shortContext: { ...initialContexts },
                                    }
                                );

                                switchToTab('Saved');

                                const button = screen.getByRole('button', {
                                    name: title,
                                });
                                await fireEvent.click(button);

                                const draggableItem = getDnDConfig(
                                    componentType.toLowerCase()
                                );

                                const canDrop = handleCanDrop(
                                    {
                                        ...draggableItem,
                                        address: '',
                                        parentType: '',
                                    },
                                    overItem,
                                    () => {
                                        return {};
                                    }
                                );

                                const draggableElement = screen.getByTestId(
                                    `card-${id}`
                                );

                                let droppableArea = screen.getByTestId(testId);
                                dragAndDrop({
                                    draggableElement,
                                    droppableArea,
                                });

                                let insertAddress;

                                if (canDrop) {
                                    insertAddress = address.replace(
                                        /\d$/,
                                        (m) => `${m - 1}`
                                    );
                                } else if (
                                    propagatesDroppingOver.includes(type)
                                ) {
                                    insertAddress = getInsertAddress({
                                        dragType: title,
                                        dropAddress: address,
                                        dropType: type,
                                        dropParentType: parentType,
                                    });
                                }

                                await waitFor(() => {
                                    if (insertAddress) {
                                        expect(
                                            mockAddElement
                                        ).toHaveBeenCalledWith({
                                            elType: componentType,
                                            addElType: componentType,
                                            type: draggableItem.type,
                                            data: JSON.parse(data),
                                            insertAddress,
                                        });
                                    } else {
                                        mockAddElement.mockRestore();
                                        expect(
                                            mockAddElement
                                        ).not.toHaveBeenCalled();
                                    }
                                });
                            }
                        );

                        it('should dnd logic work when dragging from the components drawer into the empry page', async () => {
                            render(
                                <>
                                    <Component />
                                    <RecursiveRender
                                        type="page"
                                        page={{}}
                                        content={[]}
                                        onDragItem={mockOnDragItem}
                                        siteId="xyz"
                                    />
                                </>,
                                {
                                    shortContext: { ...initialContexts },
                                }
                            );

                            switchToTab('Saved');

                            const button = screen.getByRole('button', {
                                name: title,
                            });
                            await fireEvent.click(button);

                            const draggableElement = screen.getByTestId(
                                `card-${id}`
                            );

                            let droppableArea =
                                screen.getByTestId('empty-page');
                            dragAndDrop({
                                draggableElement,
                                droppableArea,
                            });

                            const nextEditAdress = {
                                SECTION: '0',
                                ROW: '0.0',
                                COLUMN: '0.0.0',
                                ELEMENT: '0.0.0.0',
                                CONTAINER: '0.0.0.0',
                            }[componentType];

                            if (componentType !== 'SECTION') {
                                const dataDroppedWith =
                                    generateDataWithParentElements({
                                        dragType: getDnDConfig(
                                            componentType.toLowerCase()
                                        ).type,
                                        dragData: JSON.parse(data),
                                    });

                                await waitFor(() => {
                                    expect(mockAddElement).toHaveBeenCalledWith(
                                        {
                                            type: 'section',
                                            elType: 'SECTION',
                                            addElType: 'SECTION',
                                            insertAddress: '-1',
                                            nextEditAdress,
                                            data: dataDroppedWith,
                                        }
                                    );
                                });
                            } else {
                                await waitFor(() => {
                                    expect(mockAddElement).toHaveBeenCalledWith(
                                        {
                                            type: 'section',
                                            elType: 'SECTION',
                                            addElType: 'SECTION',
                                            insertAddress: '-1',
                                            nextEditAdress,
                                            data: JSON.parse(data),
                                        }
                                    );
                                });
                            }
                        });
                    }
                );
            }
        );
        it.each(elementsInfo)(
            'should not refetch while reExpanding panel %s and switching tab then coming back to saved elements again ',
            async ({ type: title, cacheKey }) => {
                render(<Component />, {
                    shortContext: { ...initialContexts },
                });
                fireEvent.click(
                    screen.getByRole('radio', {
                        name: 'Saved',
                    })
                );

                const button = screen.getByRole('button', {
                    name: title,
                });

                expect(button).toHaveAttribute('aria-expanded', 'false');
                fireEvent.click(button);
                expect(
                    screen.getByRole('button', {
                        name: title,
                    })
                ).toHaveAttribute('aria-expanded', 'true');
                //testing if  fetching on the initial expand
                await waitFor(() => {
                    expect(mockGetSavedElements).toHaveBeenCalledWith(
                        title,
                        cacheKey
                    );
                });

                //testing if  not fetching after re-expanding panel
                mockGetSavedElements.mockReset();
                fireEvent.click(button);
                fireEvent.click(button);
                await waitFor(() => {
                    expect(mockGetSavedElements).not.toHaveBeenCalledWith(
                        title,
                        cacheKey
                    );
                });

                //testing if  not fetching after switching
                mockGetSavedElements.mockReset();
                fireEvent.click(
                    screen.getByRole('radio', {
                        name: 'Library',
                    })
                );
                fireEvent.click(
                    screen.getByRole('radio', {
                        name: 'Saved',
                    })
                );
                fireEvent.click(button);
                await waitFor(() => {
                    expect(mockGetSavedElements).not.toHaveBeenCalledWith(
                        title,
                        cacheKey
                    );
                });
            }
        );
    });

    describe('Symbols', () => {
        const elementsInfo = [
            { type: 'SECTION' },
            { type: 'ROW' },
            { type: 'COLUMN' },
            { type: 'ELEMENT' },
            { type: 'CONTAINER' },
        ];

        describe.each(elementsInfo)('### Tag: $type ###', ({ type: title }) => {
            const symbnolTypeSpecificData = Object.values(mockSymbols).filter(
                (symbol) =>
                    symbol.data._elType === 'CMSROW'
                        ? title === 'ROW'
                        : symbol.data._elType === title
            );
            it(`should expand and collapse work properly for tag>> '${title}' by rendering correct number of symbols`, async () => {
                render(<Component />, {
                    shortContext: { ...initialContexts },
                });

                switchToTab('Symbols');

                await checkExpandCollapseWithComponentsLength({
                    title,
                    expectedComponents: symbnolTypeSpecificData,
                });
            });

            describe.each(symbnolTypeSpecificData)(
                `component-$id`,
                ({ thumbnail, id, name }) => {
                    it(`should render image under tag>${title}  ${id} have correct thumbnail of ${
                        thumbnail || '/assets/images/image-placeholder.jpg'
                    } on list view ${
                        thumbnail ? 'and preview' : 'only'
                    }`, async () => {
                        render(<Component />, {
                            shortContext: { ...initialContexts },
                        });
                        await switchToTab('Symbols');
                        const button = await screen.findByRole('button', {
                            name: title,
                        });
                        fireEvent.click(button);
                        await checkThumbNailAndPreview({
                            thumbnail,
                            name,
                            id,
                        });
                    });

                    // it.each([
                    //     {
                    //         type: 'section',
                    //         address: '0',
                    //         parentType: 'page',
                    //         testId: 'section-0',
                    //     },
                    //     {
                    //         type: 'row',
                    //         address: '0.0',
                    //         parentType: 'section',
                    //         testId: 'row-0.0',
                    //     },
                    //     {
                    //         type: 'column',
                    //         address: '0.0.0',
                    //         parentType: 'row',
                    //         testId: 'column-0.0.0',
                    //     },
                    //     {
                    //         type: 'component',
                    //         address: '0.0.0.0',
                    //         parentType: 'column',
                    //         testId: 'heading-0.0.0.0',
                    //     },
                    //     {
                    //         type: 'container',
                    //         address: '1.0',
                    //         parentType: 'section',
                    //         testId: 'container-1.0',
                    //     },
                    //     {
                    //         type: 'container',
                    //         address: '1.0.0',
                    //         parentType: 'container',
                    //         testId: 'container-1.0.0',
                    //     },
                    //     {
                    //         type: 'component',
                    //         address: '1.0.0.0.0',
                    //         parentType: 'container',
                    //         testId: 'accordion-1.0.0.0.0',
                    //     },
                    // ])(
                    //     'should dnd logic work when moving from the components drawer into the page over type: $type parentType:$parentType',
                    //     async (overItem) => {
                    //         const { type, address, parentType, testId } =
                    //             overItem;

                    //         renderComponent({
                    //             children: (
                    //                 <>
                    //                     <Library />
                    //                     <RecursiveRender
                    //                         type="page"
                    //                         page={{}}
                    //                         content={pageWithContainer.content}
                    //                         onDragItem={mockOnDragItem}
                    //                         siteId="xyz"
                    //                     />
                    //                 </>
                    //             ),
                    //         });

                    //         switchToTab('Saved');

                    //         const button = screen.getByRole('button', {
                    //             name: title,
                    //         });
                    //         fireEvent.click(button);

                    //         const draggableItem = getDnDConfig(
                    //             componentType.toLowerCase()
                    //         );

                    //         const canDrop = handleCanDrop(
                    //             {
                    //                 ...draggableItem,
                    //                 address: '',
                    //                 parentType: '',
                    //             },
                    //             overItem
                    //         );

                    //         const draggableElement = screen.getByTestId(
                    //             `card-${id}`
                    //         );

                    //         let droppableArea = screen.getByTestId(testId);
                    //         dragAndDrop({
                    //             draggableElement,
                    //             droppableArea,
                    //         });

                    //         let insertAddress;

                    //         if (canDrop) {
                    //             insertAddress = address.replace(
                    //                 /\d$/,
                    //                 (m) => `${m - 1}`
                    //             );
                    //         } else if (propagatesDroppingOver.includes(type)) {
                    //             insertAddress = getInsertAddress({
                    //                 dragType: title,
                    //                 dropAddress: address,
                    //                 dropType: type,
                    //                 dropParentType: parentType,
                    //             });
                    //         }

                    //         await waitFor(() => {
                    //             if (insertAddress) {
                    //                 expect(mockAddElement).toHaveBeenCalledWith(
                    //                     {
                    //                         elType: componentType,
                    //                         addElType: componentType,
                    //                         type: draggableItem.type,
                    //                         data: JSON.parse(data),
                    //                         insertAddress,
                    //                     }
                    //                 );
                    //             } else {
                    //                 mockAddElement.mockRestore();
                    //                 expect(
                    //                     mockAddElement
                    //                 ).not.toHaveBeenCalled();
                    //             }
                    //         });
                    //     }
                    // );

                    it(`should render custom drag preview with thumbnail: ${
                        thumbnail || '/assets/images/image-placeholder.jpg'
                    } and tag:${title}`, async () => {
                        render(
                            <Drawer isOpen="true" drawerName="components" />,
                            {
                                shortContext: { ...initialContexts },
                            }
                        );
                        switchToTab('Symbols');
                        const button = await screen.findByRole('button', {
                            name: title,
                        });
                        await fireEvent.click(button);

                        await checkCustomDragPreview({
                            id,
                            thumbnail:
                                thumbnail ||
                                '/assets/images/image-placeholder.jpg',
                            componentType: title,
                            name,
                        });
                    });
                }
            );
        });
    });
});

const dragAndDrop = async ({ draggableElement, droppableArea }) => {
    fireEvent.dragStart(draggableElement);
    fireEvent.dragEnter(droppableArea);
    fireEvent.dragOver(droppableArea);
    fireEvent.drop(droppableArea);
};

const switchToTab = async (tab) => {
    await fireEvent.click(
        screen.getByRole('radio', {
            name: tab,
        })
    );
};

const checkExpandCollapseWithComponentsLength = async ({
    title,
    cacheKey,
    expectedComponents,
}) => {
    const button = await screen.findByRole('button', {
        name: title,
    });

    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    if (cacheKey) {
        expect(mockGetVisibleElements).toHaveBeenCalledWith(cacheKey);
    }
    expect(
        await screen.findByRole('button', {
            name: title,
        })
    ).toHaveAttribute('aria-expanded', 'true');

    // checking if the total coponents length belong to this specific tag  matches the length of the rendered image length
    const cards = queryAllByClassName('ant-card');
    expect(cards.length).toBe(expectedComponents.length);
};

const checkThumbNailAndPreview = async ({ thumbnail, id, name }) => {
    const card = await screen.findByTestId(`card-${id}`);

    const image = within(card).getByRole('img');
    //checking if the image correctly renderd inside the collapse panel
    expect(image).toHaveAttribute(
        'src',
        thumbnail || '/assets/images/image-placeholder.jpg'
    );
    //checking if the name also rendered correctly
    expect(within(card).getByText(name)).toBeInTheDocument();
    //check if all images including card image and preview img have 100% of width
    screen.getAllByRole('img').forEach((img) => {
        expect(img).toHaveAttribute('width', '100%');
    });
    fireEvent.mouseOver(card);
    //testing if the hover preview works properly
    if (thumbnail) {
        const previewImage = within(
            screen.queryByTestId(`previewImg-${id}`)
        ).queryByRole('img');
        expect(previewImage).toHaveAttribute('src', thumbnail);
        const popOverContainer = previewImage.closest(
            '.ant-popover-placement-rightTop'
        );
        expect(popOverContainer).not.toHaveClass('ant-popover-hidden');
        expect(popOverContainer.style.width).toBe('496px');
        expect(popOverContainer.style.left).toBe('310px');
        //checking if the preview image disappears on drag start
        fireEvent.dragStart(card);
        await waitFor(() => {
            expect(popOverContainer).toHaveClass('ant-popover-hidden');
        });
    } else {
        expect(
            screen.queryByTestId(`previewImg-${id}`)
        ).not.toBeInTheDocument();
    }
};

const checkCustomDragPreview = async ({
    id,
    thumbnail,
    componentType,
    name,
}) => {
    const draggableElement = await screen.findByTestId(`card-${id}`);
    fireEvent.dragStart(draggableElement);
    const customDragPreview = await screen.findByTestId('customDragPreview');
    expect(customDragPreview).toBeInTheDocument();
    const image = within(customDragPreview).getByRole('img');
    expect(image).toHaveAttribute('src', thumbnail);
    const tag = within(customDragPreview).getByText(componentType);
    expect(tag).toBeInTheDocument();
};

const getInsertAddress = ({
    dropAddress,
    dragType,
    dropType,
    dropParentType,
}) => {
    switch (dragType) {
        case 'COLUMN':
            if (dropParentType === 'column') {
                //if dropAddress is equal to 1.0.0.0, then insetAddress will be 1.0.-1
                return dropAddress
                    .replace(/(\.\d+){1}$/, '')
                    .replace(/\d$/, (m) => `${m - 1}`);
            }
            break;
        case 'ELEMENT':
            if (dropParentType === 'container') {
                //if dropAddress is equal to 1.0.0.0, then insetAddress will be 1.0.-1
                return dropAddress
                    .replace(/(\.\d+){1}$/, '')
                    .replace(/\d$/, (m) => `${m - 1}`);
            }

            break;
        case 'ROW':
            if (dropParentType === 'row') {
                //if dropAddress is equal to 1.0.0.0, then insetAddress will be 1.0.-1
                return dropAddress
                    .replace(/(\.\d+){1}$/, '')
                    .replace(/\d$/, (m) => `${m - 1}`);
            }
            if (dropParentType === 'column') {
                //if dropAddress is equal to 1.0.0.0.0.0.1.0.0.0, then insetAddress will be 1.0.0.0.0.0.1.-1
                return dropAddress
                    .replace(/(\.\d+){2}$/, '')
                    .replace(/\d$/, (m) => `${m - 1}`);
            }
            if (dropParentType === 'container') {
                //if dropAddress is equal to 1.0.0.0.0.0.1.0, then insetAddress will be 1.-1
                return dropAddress
                    .split('.')
                    .slice(0, 2)
                    .join('.')
                    .replace(/\d$/, (m) => `${m - 1}`);
            }
            break;
        default:
            //while dragging section, if dropAddress is equal to 1.0.0.0.0.0.1.0.0.0, then insetAddress will be 0
            return `${dropAddress.split('.')[0] - 1}`;
    }
};

describe('getInsertAddress', () => {
    // Test Case 1
    test('Default case: No matching dragType', () => {
        const result = getInsertAddress({
            dropAddress: '1.0.0.0',
            dragType: 'UNKNOWN',
            dropType: 'container',
            dropParentType: 'column',
        });

        expect(result).toBe('0');
    });

    // Test Case 2
    test('dragType equals COLUMN and dropParentType equals column', () => {
        const result = getInsertAddress({
            dropAddress: '1.0.0.0',
            dragType: 'COLUMN',
            dropType: 'container',
            dropParentType: 'column',
        });

        expect(result).toBe('1.0.-1');
    });

    // Test Case 3
    test('dragType equals ELEMENT and dropParentType equals container', () => {
        const result = getInsertAddress({
            dropAddress: '1.0.0.0',
            dragType: 'ELEMENT',
            dropType: 'container',
            dropParentType: 'container',
        });

        expect(result).toBe('1.0.-1');
    });

    // Test Case 4
    test('dragType equals ROW and dropParentType equals row', () => {
        const result = getInsertAddress({
            dropAddress: '1.0.0.0',
            dragType: 'ROW',
            dropType: 'container',
            dropParentType: 'row',
        });

        expect(result).toBe('1.0.-1');
    });

    // Test Case 5
    test('dragType equals ROW and dropParentType equals column', () => {
        const result = getInsertAddress({
            dropAddress: '1.0.0.0.0.0.1.0.0.0',
            dragType: 'ROW',
            dropType: 'container',
            dropParentType: 'column',
        });

        expect(result).toBe('1.0.0.0.0.0.1.-1');
    });

    // Test Case 6
    test('dragType equals ROW and dropParentType equals container', () => {
        const result = getInsertAddress({
            dropAddress: '1.0.0.0.0.0.1.0',
            dragType: 'ROW',
            dropType: 'container',
            dropParentType: 'container',
        });

        expect(result).toBe('1.-1');
    });
});
