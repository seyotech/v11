import {
    getTreeNode,
    getNavTreeData,
    filterTreeData,
    isDropAllowedToParent,
    nodeToElementConverter,
    handleAllowNavTreeDrop,
    formatNavTreeDragAndDropData,
} from './tree';

const mockGetDataByAddress = vi.fn(() => ({}));

describe('nodeToElementConverter', () => {
    test.each(['heading', 'accordion', 'link', 'text', 'icon'])(
        'should return converted element for %s with parentType column',
        (type) => {
            const key = '0-0-0-0-0';
            const node = {
                key,
                dataRef: { type },
                parent: { type: 'column' },
            };
            const result = nodeToElementConverter(node);

            const payload = {
                ...node.dataRef,
                type: 'component',
                parentType: node.parent.type,
                address: key.slice(2).replace(/-/g, '.'),
            };

            expect(result).toStrictEqual(payload);
        }
    );

    test.each(['heading', 'accordion', 'link', 'text', 'icon'])(
        'should return converted element for %s with parentType container',
        (type) => {
            const key = '0-0-0-0-0';
            const node = {
                key,
                dataRef: { type },
                parent: { type: 'container' },
            };
            const result = nodeToElementConverter(node);

            const payload = {
                ...node.dataRef,
                type: 'component',
                parentType: node.parent.type,
                address: key.slice(2).replace(/-/g, '.'),
            };

            expect(result).toStrictEqual(payload);
        }
    );

    test.each([
        { type: 'column', parentType: 'row' },
        { type: 'row', parentType: 'section' },
        { type: 'section' },
    ])(
        'should return converted $type with parentType $parentType',
        ({ type, parentType }) => {
            const key = '0-0-0-0';
            const node = {
                key,
                dataRef: { type },
                parent: { type: parentType },
            };
            const result = nodeToElementConverter(node);

            const payload = {
                ...node.dataRef,
                type: type,
                parentType,
                address: key.slice(2).replace(/-/g, '.'),
            };

            expect(result).toStrictEqual(payload);
        }
    );
});

describe('isDropAllowedToParent', () => {
    test('parentType: row, childType: column - return true', () => {
        expect(
            isDropAllowedToParent({ parentType: 'row', childType: 'column' })
        ).toBe(true);
    });

    test('parentType: row, childType: component - return false', () => {
        expect(
            isDropAllowedToParent({ parentType: 'row', childType: 'component' })
        ).toBe(false);
    });

    test('parentType: column, childType: component - return true', () => {
        expect(
            isDropAllowedToParent({
                parentType: 'column',
                childType: 'component',
            })
        ).toBe(true);
    });

    test('parentType: column, childType: row - return false', () => {
        expect(
            isDropAllowedToParent({ parentType: 'column', childType: 'row' })
        ).toBe(false);
    });

    test('parentType: section, childType: row - return true', () => {
        expect(
            isDropAllowedToParent({ parentType: 'section', childType: 'row' })
        ).toBe(true);
    });

    test('parentType: section, childType: container - return true', () => {
        expect(
            isDropAllowedToParent({
                parentType: 'section',
                childType: 'container',
            })
        ).toBe(true);
    });

    test('parentType: section, childType: component - return false', () => {
        expect(
            isDropAllowedToParent({
                parentType: 'section',
                childType: 'component',
            })
        ).toBe(false);
    });

    test('parentType: container, childType: container - return true', () => {
        expect(
            isDropAllowedToParent({
                parentType: 'container',
                childType: 'container',
            })
        ).toBe(true);
    });

    test('parentType: container, childType: component - return true', () => {
        expect(
            isDropAllowedToParent({
                parentType: 'container',
                childType: 'component',
            })
        ).toBe(true);
    });

    test('parentType: container, childType: row - return false', () => {
        expect(
            isDropAllowedToParent({ parentType: 'container', childType: 'row' })
        ).toBe(false);
    });

    test('parentType: container, childType: column - return false', () => {
        expect(
            isDropAllowedToParent({
                parentType: 'container',
                childType: 'column',
            })
        ).toBe(false);
    });

    test('parentType: unknown, childType: column - return false', () => {
        expect(
            isDropAllowedToParent({
                parentType: 'unknown',
                childType: 'column',
            })
        ).toBe(false);
    });

    test('parentType: row, childType: unknown - return false', () => {
        expect(
            isDropAllowedToParent({ parentType: 'row', childType: 'unknown' })
        ).toBe(false);
    });
});

describe('formatNavTreeDragAndDropData', () => {
    // Sample input and expected output for testing
    const sampleProps = {
        dragNode: {
            key: '0-0-0-0-0',
            dataRef: {
                type: 'text',
            },
            parent: {
                type: 'column',
            },
        },
        node: {
            dataRef: {
                type: 'column',
            },
            parent: {
                type: 'row',
            },
            key: '0-0-0',
        },
        dropToGap: true,
        dropPosition: 1,
    };

    it('should correctly format drag and drop data for dropping as children when drop is allowed to parent and not to sibling', () => {
        const result = formatNavTreeDragAndDropData(sampleProps);
        const source = nodeToElementConverter(sampleProps.dragNode);
        const destination = nodeToElementConverter(sampleProps.node);

        destination.address = `${destination.address}.0`;
        const expectedOutput = {
            source,
            destination,
        };

        expect(result).toEqual(expectedOutput);
    });

    it('should correctly format drag and drop data for dropping as sibling at a given position', () => {
        const props = {
            ...sampleProps,
            dropToGap: false,
        };
        const source = nodeToElementConverter(sampleProps.dragNode);
        const destination = nodeToElementConverter(sampleProps.node);

        destination.address = `${destination.address}.0`;
        const expectedOutput = {
            source,
            destination,
        };

        const result = formatNavTreeDragAndDropData(props);

        expect(result).toEqual(expectedOutput);
    });

    it('should correctly format drag and drop data for dropping as a sibling', () => {
        const sampleProps = {
            dragNode: {
                key: '0-0-0-0',
                dataRef: {
                    type: 'column',
                },
                parent: {
                    type: 'row',
                },
            },
            node: {
                dataRef: {
                    type: 'column',
                },
                parent: {
                    type: 'row',
                },
                key: '0-0-0-1',
            },
            dropToGap: true,
            dropPosition: 1,
        };
        const result = formatNavTreeDragAndDropData(sampleProps);

        const source = nodeToElementConverter(sampleProps.dragNode);
        const destination = nodeToElementConverter(sampleProps.node);

        destination.address = destination.address.replace(
            /\d$/gi,
            (m) => `${Number(m) + 1}`
        );
        const expectedOutput = {
            source,
            destination,
        };

        expect(result).toEqual(expectedOutput);
    });

    it('should correctly format drag and drop data for dropping as a sibling in first position', () => {
        const sampleProps = {
            dragNode: {
                key: '0-0-0-0',
                dataRef: {
                    type: 'column',
                },
                parent: {
                    type: 'row',
                },
            },
            node: {
                dataRef: {
                    type: 'column',
                },
                parent: {
                    type: 'row',
                },
                key: '0-0-0-1',
            },
            dropToGap: true,
            dropPosition: -1,
        };
        const result = formatNavTreeDragAndDropData(sampleProps);

        const source = nodeToElementConverter(sampleProps.dragNode);
        const destination = nodeToElementConverter(sampleProps.node);

        const expectedOutput = {
            source,
            destination,
        };

        expect(result).toEqual(expectedOutput);
    });
});

describe('handleAllowNavTreeDrop', () => {
    // Test case for valid input where all conditions are true
    it('should return true when drop to next position', () => {
        // Arrange
        const dragNode = {
            key: '0-0-0-0',
            dataRef: {
                type: 'column',
            },
            parent: {
                type: 'row',
            },
        };
        const dropNode = {
            dataRef: {
                type: 'column',
            },
            parent: {
                type: 'row',
            },
            key: '0-0-0-1',
        };

        // Act
        const result = handleAllowNavTreeDrop({
            dragNode,
            dropNode,
            getDataByAddress: mockGetDataByAddress,
        });

        // Assert
        expect(result).toBe(true);
    });

    it('should return true when drop container inside container as a sibling', () => {
        // Arrange
        const dragNode = {
            key: '1-0-0-0',
            dataRef: {
                type: 'container',
            },
            parent: {
                type: 'section',
            },
        };
        const dropNode = {
            dataRef: {
                type: 'container',
            },
            parent: {
                type: 'container',
            },
            key: '0-0-0-1',
        };

        // Act
        const result = handleAllowNavTreeDrop({
            dragNode,
            dropNode,
            getDataByAddress: mockGetDataByAddress,
        });

        // Assert
        expect(result).toBeTruthy();
    });

    it('should return false when row drop to column', () => {
        // Arrange
        const dragNode = {
            key: '0-0-0',
            dataRef: {
                type: 'row',
            },
            parent: {
                type: 'section',
            },
        };
        const dropNode = {
            dataRef: {
                type: 'column',
            },
            parent: {
                type: 'row',
            },
            key: '0-0-0',
        };

        // Act
        const result = handleAllowNavTreeDrop({
            dragNode,
            dropNode,
            getDataByAddress: mockGetDataByAddress,
        });

        // Assert
        expect(result).toBeFalsy();
    });

    //     // Test case for dragNode and dropNode being the same
    it.each(['section', 'row', 'container', 'column', 'text'])(
        'should return true when dragNode and dropNode are the same',
        (type) => {
            // Arrange
            const dragNode = {
                key: '0-0-0',
                dataRef: {
                    type,
                },
                parent: {
                    type: 'section',
                },
            };
            const dropNode = {
                dataRef: {
                    type,
                },
                parent: {
                    type: 'row',
                },
                key: '0-0-1',
            };

            // Act
            const result = handleAllowNavTreeDrop({
                dragNode,
                dropNode,
                getDataByAddress: mockGetDataByAddress,
            });

            // Assert
            expect(result).toBeTruthy();
        }
    );

    it('should return false when dragNode and dropNode are different', () => {
        // Arrange
        const dragNode = {
            key: '0-0-0',
            dataRef: {
                type: 'row',
            },
            parent: {
                type: 'section',
            },
        };
        const dropNode = {
            dataRef: {
                type: 'column',
            },
            parent: {
                type: 'row',
            },
            key: '0-0-6',
        };

        // Act
        const result = handleAllowNavTreeDrop({
            dragNode,
            dropNode,
            getDataByAddress: mockGetDataByAddress,
        });

        // Assert
        expect(result).toBeFalsy();
    });

    it.each(['section', 'row', 'column', 'text'])(
        'should return false when dragNode and dropNode are the same but position are same',
        (type) => {
            // Arrange
            const dragNode = {
                key: '0-0-0',
                dataRef: {
                    type,
                },
                parent: {
                    type: 'section',
                },
            };
            const dropNode = {
                dataRef: {
                    type,
                },
                parent: {
                    type: 'row',
                },
                key: '0-0-0',
            };

            // Act
            const result = handleAllowNavTreeDrop({
                dragNode,
                dropNode,
                getDataByAddress: mockGetDataByAddress,
            });

            // Assert
            expect(result).toBeFalsy();
        }
    );
});

describe('getNavTreeData', () => {
    const sampleData = {
        data: {
            name: 'Section 1',
            type: 'section',
            content: [
                {
                    type: 'row',
                    name: 'Row 1',
                    content: [
                        {
                            type: 'column',
                            name: 'Col 1',
                            content: [
                                {
                                    name: 'Text',
                                    type: 'element',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        symbols: {
            1: {
                name: 'Node 1',
                data: {
                    name: 'Symbol 1',
                },
            },
        },
    };
    it('should return an empty array when given an empty data object', () => {
        const result = getNavTreeData({ data: {} });
        expect(result).toEqual([]);
    });

    it('should return an empty array when data.content is not an array', () => {
        const result = getNavTreeData({ data: { content: {} } });
        expect(result).toEqual([]);
    });

    it('should return an array of tree nodes with valid data', () => {
        const result = getNavTreeData({
            data: sampleData.data,
            symbols: sampleData.symbols,
        });
        expect(result).toEqual([
            {
                key: '0-0',
                dataRef: {
                    ...sampleData.data.content[0],
                    parentType: sampleData.data.type,
                },
                parent: sampleData.data,
                className: '',
                title: sampleData.data.content[0].name,
                children: [
                    {
                        key: '0-0-0',
                        dataRef: {
                            ...sampleData.data.content[0].content[0],
                            parentType: sampleData.data.content[0].type,
                        },
                        parent: {
                            ...sampleData.data.content[0],
                            parentType: sampleData.data.type,
                        },
                        className: '',
                        title: sampleData.data.content[0].content[0].name,
                        children: [
                            {
                                key: '0-0-0-0',
                                dataRef: {
                                    ...sampleData.data.content[0].content[0]
                                        .content[0],
                                    parentType:
                                        sampleData.data.content[0].content[0]
                                            .type,
                                },
                                parent: {
                                    ...sampleData.data.content[0].content[0],
                                    parentType: sampleData.data.content[0].type,
                                },
                                className: '',
                                title: sampleData.data.content[0].content[0]
                                    .content[0].name,
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('should skip items without valid symbols', () => {
        const data = {
            content: [{ symbolId: 1 }, { symbolId: 2 }, { symbolId: 3 }],
        };
        const symbols = {
            1: {
                name: 'Node 1',
                data: {
                    name: 'Symbol 1',
                },
            },
            3: {
                name: 'Node 3',
                data: {
                    name: 'Symbol 3',
                },
            },
        };
        const result = getNavTreeData({ data, symbols });
        expect(result).toEqual([
            {
                key: '0-0',
                className: 'global-symbol',
                dataRef: {
                    ...symbols[data.content[0].symbolId].data,
                    parentType: data.type,
                },
                parent: data,
                title: `${symbols[data.content[0].symbolId].data.name} ( ${
                    symbols[data.content[0].symbolId].name
                } )`,
            },
            {
                key: '0-2',
                className: 'global-symbol',
                dataRef: {
                    ...symbols[data.content[2].symbolId].data,
                    parentType: data.type,
                },
                parent: data,
                title: `${symbols[data.content[2].symbolId].data.name} ( ${
                    symbols[data.content[2].symbolId].name
                } )`,
            },
        ]);
    });

    it('should return an array of tree nodes with valid data with items and symbols', () => {
        const data = {
            type: 'column',
            content: [{ symbolId: 1 }, { type: 'element', name: 'button' }],
        };
        const symbols = {
            1: {
                name: 'Node 1',
                data: {
                    name: 'Symbol 1',
                },
            },
        };
        const result = getNavTreeData({ data, symbols });
        expect(result).toEqual([
            {
                key: '0-0',
                className: 'global-symbol',
                dataRef: {
                    ...symbols[data.content[0].symbolId].data,
                    parentType: data.type,
                },
                parent: data,
                title: `${symbols[data.content[0].symbolId].data.name} ( ${
                    symbols[data.content[0].symbolId].name
                } )`,
            },
            {
                key: '0-1',
                className: '',
                dataRef: {
                    ...data.content[1],
                    parentType: data.type,
                },
                parent: data,
                title: data.content[1].name,
            },
        ]);
    });
});

describe('getTreeNode', () => {
    // Mocking the symbols object for testing
    const symbols = {
        1: {
            data: {
                name: 'Symbol 1',
            },
            name: 'Symbol 1 Name',
        },
    };

    // Sample data for testing
    const sampleData = {
        item: {
            symbolId: 1,
        },
        symbols,
        key: '1',
        data: {
            type: 'parentType',
        },
    };

    it('should return a tree node with the correct title when the item has a symbolId', () => {
        const expectedOutput = {
            key: '1',
            title: 'Symbol 1 ( Symbol 1 Name )',
            dataRef: {
                name: 'Symbol 1',
                parentType: 'parentType',
            },
            className: 'global-symbol',
            parent: {
                type: 'parentType',
            },
        };

        const newData = {
            ...sampleData,
            item: {
                symbolId: 1,
            },
        };

        const result = getTreeNode(newData);

        expect(result).toEqual(expectedOutput);
    });

    it('should return a tree node without the global-symbol className when the item does not have a symbolId', () => {
        const expectedOutput = {
            key: '1',
            title: 'SomeItemName',
            dataRef: {
                name: 'SomeItemName',
                parentType: 'parentType',
            },
            className: '',
            parent: {
                type: 'parentType',
            },
        };

        const newData = {
            ...sampleData,
            item: {
                name: 'SomeItemName',
            },
        };

        const result = getTreeNode(newData);

        expect(result).toEqual(expectedOutput);
    });

    it('should return a tree node without the global-name postfix when the item does not have a symbolId', () => {
        const expectedOutput = {
            key: '1',
            title: 'Element Title',
            dataRef: {
                name: 'Element Title',
                parentType: 'parentType',
            },
            className: '',
            parent: {
                type: 'parentType',
            },
        };

        const newData = {
            ...sampleData,
            item: {
                name: 'Element Title',
            },
        };

        const result = getTreeNode(newData);

        expect(result).toEqual(expectedOutput);
    });

    it('should return a tree node with the correct dataRef parentType when the item has a symbolId', () => {
        const expectedOutput = {
            key: '1',
            title: 'Symbol 1 ( Symbol 1 Name )',
            dataRef: {
                name: 'Symbol 1',
                parentType: 'parentType',
            },
            className: 'global-symbol',
            parent: {
                type: 'parentType',
            },
        };

        const result = getTreeNode(sampleData);

        expect(result).toEqual(expectedOutput);
    });

    it('should return a tree node with the correct key', () => {
        const expectedOutput = {
            key: '123',
            title: 'Symbol 1 ( Symbol 1 Name )',
            dataRef: {
                name: 'Symbol 1',
                parentType: 'parentType',
            },
            className: 'global-symbol',
            parent: {
                type: 'parentType',
            },
        };

        const newData = {
            ...sampleData,
            key: '123',
        };

        const result = getTreeNode(newData);

        expect(result).toEqual(expectedOutput);
    });
});

describe('filterTreeData', () => {
    it('should return the original treeData when search is empty', () => {
        const treeData = [
            {
                title: 'Node 1',
                children: [
                    {
                        title: 'Node 1.1',
                        children: [],
                    },
                    {
                        title: 'Node 1.2',
                        children: [],
                    },
                ],
            },
            {
                title: 'Node 2',
                children: [],
            },
        ];
        const search = '';

        const result = filterTreeData({ treeData, search });

        expect(result).toEqual(treeData);
    });

    it('should return an empty array when search does not match any title', () => {
        const treeData = [
            {
                title: 'Node 1',
                children: [],
            },
            {
                title: 'Node 2',
                children: [],
            },
        ];
        const search = 'Node 3';

        const result = filterTreeData({ treeData, search });

        expect(result).toEqual([]);
    });

    it('should return the nodes that match the search term', () => {
        const treeData = [
            {
                title: 'Node 1',
                children: [],
            },
            {
                title: 'Node 2',
                children: [],
            },
        ];
        const search = 'Node 2';

        const result = filterTreeData({ treeData, search });

        expect(result).toEqual([
            {
                title: 'Node 2',
                children: [],
            },
        ]);
    });

    it('should return the parent nodes that have matching children', () => {
        const treeData = [
            {
                title: 'Node 1',
                children: [
                    {
                        title: 'Node 1.1',
                        children: [],
                    },
                    {
                        title: 'Node 1.2',
                        children: [],
                    },
                ],
            },
            {
                title: 'Node 2',
                children: [
                    {
                        title: 'Node 2.1',
                        children: [],
                    },
                    {
                        title: 'Node 2.2',
                        children: [],
                    },
                ],
            },
        ];
        const search = '2.1';

        const result = filterTreeData({ treeData, search });

        expect(result).toEqual([
            {
                title: 'Node 2',
                children: [
                    {
                        title: 'Node 2.1',
                        children: [],
                    },
                ],
            },
        ]);
    });

    it('should return the parent nodes that have matching children within multiple section', () => {
        const treeData = [
            {
                title: 'Node 1',
                children: [
                    {
                        title: 'Node 1.1',
                        children: [],
                    },
                    {
                        title: 'Node 1.2',
                        children: [],
                    },
                    {
                        title: 'Node 2.1',
                        children: [],
                    },
                ],
            },
            {
                title: 'Node 2',
                children: [
                    {
                        title: 'Node 2.1',
                        children: [],
                    },
                    {
                        title: 'Node 2.2',
                        children: [],
                    },
                ],
            },
        ];
        const search = '2.1';

        const result = filterTreeData({ treeData, search });

        expect(result).toEqual([
            {
                title: 'Node 1',
                children: [
                    {
                        title: 'Node 2.1',
                        children: [],
                    },
                ],
            },
            {
                title: 'Node 2',
                children: [
                    {
                        title: 'Node 2.1',
                        children: [],
                    },
                ],
            },
        ]);
    });

    it('should not modify the original treeData array', () => {
        const treeData = [
            {
                title: 'Node 1',
                children: [],
            },
            {
                title: 'Node 2',
                children: [],
            },
        ];
        const search = 'Node 2';

        filterTreeData({ treeData, search });

        expect(treeData).toStrictEqual(treeData);
    });
});
