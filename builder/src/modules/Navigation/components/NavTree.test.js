import NavTree from './NavTree';
import { currentPageInfo, symbols } from '../__mocks__/navigation-tree';
import { render, screen, userEvent, fireEvent } from '@/util/test-utils';

const mockShowSettingModal = vi.fn();
const mockOnDrag = vi.fn();

const noop = () => {};

const initialProps = {
    symbols: {},
    onDragItem: mockOnDrag,
    currentPageInfo: { data: {} },
    showSettingsModal: mockShowSettingModal,
    currentEditAddress: noop,
    onElementRightClick: noop,
};

const dragAndDrop = async ({ draggableNode, dropTargetNode }) => {
    await fireEvent.dragStart(draggableNode);
    await fireEvent.dragEnter(dropTargetNode);
    await fireEvent.dragOver(dropTargetNode);
    await fireEvent.drop(dropTargetNode);
};

const shortContext = { ...initialProps };

describe('NavTree', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    test('renders the component with empty tree data', () => {
        // Render the component with the valid props
        render(<NavTree />, { shortContext });

        // Verify that the component renders the expected output
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    test('calls showSettingsModal function when a tree node is selected', async () => {
        render(<NavTree />, {
            shortContext: { ...shortContext, currentPageInfo },
        });

        // Select the tree node
        const [section1, section2] = screen.getAllByText('Section');

        // Verify that the showSettingsModal function is called with the expected argument
        await userEvent.click(section1);
        expect(mockShowSettingModal).toHaveBeenCalledWith(
            'COMPONENT_SETTINGS',
            '0',
            'NAVIGATION_TREE'
        );

        await userEvent.click(section2);
        expect(mockShowSettingModal).toHaveBeenCalledWith(
            'COMPONENT_SETTINGS',
            '1',
            'NAVIGATION_TREE'
        );

        const row = screen.getByText('Row 1');

        await userEvent.click(row);
        expect(mockShowSettingModal).toHaveBeenCalledWith(
            'COMPONENT_SETTINGS',
            '0.0',
            'NAVIGATION_TREE'
        );
    });

    test('calls onDragItem function when a tree node is dragged and dropped', async () => {
        // Render the component with the valid props
        render(<NavTree />, {
            shortContext: { ...shortContext, currentPageInfo },
        });

        const [draggableNode, dropTargetNode] = screen.getAllByText('Section');

        // Simulate the drag and drop event
        await dragAndDrop({ draggableNode, dropTargetNode });

        // Verify that the onDragItem function is called with the expected arguments
        expect(mockOnDrag).toHaveBeenCalledWith(
            expect.objectContaining({
                source: expect.objectContaining({ address: '0' }),
                destination: expect.objectContaining({ address: '2' }),
            })
        );
    });

    test('renders the switcher icon with correct rotation when node is expanded', async () => {
        // Render the component with the valid props
        render(<NavTree />, {
            shortContext: { ...shortContext, currentPageInfo },
        });

        // Wait for the component to fetch and render the tree data
        const section = screen.getAllByText('Section')[0];

        // Click on the switcher icon to expand the node
        await userEvent.click(section);

        // Assert that the switcher icon has the correct rotation class
        expect(screen.getAllByTestId('switcher-icon')[0]).toHaveClass(
            'fa-rotate-90'
        );

        await userEvent.click(section);

        expect(screen.getAllByTestId('switcher-icon')[0]).not.toHaveClass(
            'fa-rotate-90'
        );
    });

    test('should not allowed drop section inside row, column, or inside any element', async () => {
        // Render the component with the valid props
        render(<NavTree />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        const [draggableNode, section2] = screen.getAllByText('Section');
        await userEvent.click(section2);

        // drop on row
        let dropTargetNode = screen.getByTestId('node-0-1-0');
        expect(dropTargetNode).toHaveTextContent('Row');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();

        // drop on column
        await userEvent.click(dropTargetNode);
        dropTargetNode = screen.getByTestId('node-0-1-0-0');
        expect(dropTargetNode).toHaveTextContent('Column');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();

        // drop on element
        await userEvent.click(dropTargetNode);
        dropTargetNode = screen.getByTestId('node-0-1-0-0-0');
        expect(dropTargetNode).toHaveTextContent('Image');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();
    });

    test('should not allowed drop row as a sibling of a section, inside column, or inside any element', async () => {
        // Render the component with the valid props
        render(<NavTree />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        const section1 = screen.getByTestId('node-0-0');
        await userEvent.click(section1);

        const draggableNode = screen.getByTestId('node-0-0-0');
        expect(draggableNode).toHaveTextContent('Row');

        // drop on section
        let dropTargetNode = screen.getByTestId('node-0-1');
        expect(dropTargetNode).toHaveTextContent('Section');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();

        // drop on column
        await userEvent.click(dropTargetNode);
        await userEvent.click(screen.getByTestId('node-0-1-0'));
        // here will be called as this is a row
        mockOnDrag.mockReset();

        dropTargetNode = screen.getByTestId('node-0-1-0-0');
        expect(dropTargetNode).toHaveTextContent('Column');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();

        // drop on element
        await userEvent.click(dropTargetNode);
        dropTargetNode = screen.getByTestId('node-0-1-0-0-0');
        expect(dropTargetNode).toHaveTextContent('Image');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();
    });

    test('should not allowed drop column as a sibling of a section, a row, or any element', async () => {
        // Render the component with the valid props
        render(<NavTree />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        const section1 = screen.getByTestId('node-0-0');
        await userEvent.click(section1);
        const row1 = screen.getByTestId('node-0-0-0');
        await userEvent.click(row1);

        const draggableNode = screen.getByTestId('node-0-0-0-0');
        expect(draggableNode).toHaveTextContent('Column');

        // drop on section
        let dropTargetNode = screen.getByTestId('node-0-1');
        expect(dropTargetNode).toHaveTextContent('Section');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();

        // drop on row
        await userEvent.click(dropTargetNode);
        dropTargetNode = screen.getByTestId('node-0-1-0');
        expect(dropTargetNode).toHaveTextContent('Row');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();

        // drop on element
        await userEvent.click(dropTargetNode);
        await userEvent.click(screen.getByTestId('node-0-1-0-0'));
        // here will be called as this is a column
        mockOnDrag.mockReset();

        dropTargetNode = await screen.findByTestId('node-0-1-0-0-0');
        expect(dropTargetNode).toHaveTextContent('Image');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();
    });

    test('should not allowed drop element inside a section,row,', async () => {
        // Render the component with the valid props
        render(<NavTree />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        const section1 = screen.getByTestId('node-0-0');
        await userEvent.click(section1);
        const row1 = screen.getByTestId('node-0-0-0');
        await userEvent.click(row1);
        const col1 = screen.getByTestId('node-0-0-0-0');
        await userEvent.click(col1);

        const draggableNode = screen.getByTestId('node-0-0-0-0-0');
        expect(draggableNode).toHaveTextContent(/Button/gi);

        // drop on section
        let dropTargetNode = screen.getByTestId('node-0-1');
        expect(dropTargetNode).toHaveTextContent('Section');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();

        // drop on row
        await userEvent.click(dropTargetNode);
        dropTargetNode = await screen.findByTestId('node-0-1-0');
        expect(dropTargetNode).toHaveTextContent('Row');
        dragAndDrop({ draggableNode, dropTargetNode });
        expect(mockOnDrag).not.toHaveBeenCalled();
    });

    test('does not render the element when searching for a non-matching node', async () => {
        // Render the component with the valid props
        render(<NavTree search="test" />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        // Assert that the non-matching node is not rendered
        expect(screen.queryByText('node-0-0')).toBeNull();
        expect(screen.queryByText('node-0-1')).toBeNull();
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    test('renders only the matching element when searching for a matching node', async () => {
        // Render the component with the valid props
        render(<NavTree search="title" />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        // Assert that the non-matching node is not rendered
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.queryByText('Navigation')).toBeNull();
    });

    test('should not draggable when search is applied', async () => {
        // Render the component with the valid props
        render(<NavTree search="title" />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        const row = screen.getByText('Row 1');
        expect(row.closest('.ant-tree-treenode')).toHaveAttribute(
            'draggable',
            'false'
        );

        const title = screen.getByText('Title');
        expect(title.closest('.ant-tree-treenode')).toHaveAttribute(
            'draggable',
            'false'
        );
    });

    test('should not allowed nested row, column drag and drop', async () => {
        // Render the component with the valid props
        render(<NavTree />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        const section = screen.getByTestId('node-0-2');
        await userEvent.click(section);
        const row = screen.getByText('Row');
        await userEvent.click(row);
        const col = screen.getByText('Column');
        await userEvent.click(col);

        // nested row is not draggable and droppable
        const nestedRow = screen.getByTestId('node-0-2-0-0-0');
        expect(nestedRow).toHaveTextContent('Row');
        expect(nestedRow.closest('.ant-tree-treenode')).toHaveAttribute(
            'draggable',
            'false'
        );
        await userEvent.click(nestedRow);

        // nested column is not draggable and droppable
        const nestedCol = screen.getByTestId('node-0-2-0-0-0-0');
        expect(nestedCol).toHaveTextContent('Column');
        expect(nestedCol.closest('.ant-tree-treenode')).toHaveAttribute(
            'draggable',
            'false'
        );
        await userEvent.click(nestedCol);

        // nested element is not draggable and droppable
        const nestedElement = screen.getByTestId('node-0-2-0-0-0-0-0');
        expect(nestedElement).toHaveTextContent('Accordion');
        expect(nestedElement.closest('.ant-tree-treenode')).toHaveAttribute(
            'draggable',
            'false'
        );
    });

    test('should expand parent for matching children', async () => {
        // Render the component with the valid props
        render(<NavTree search="image" />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        const image = screen.getByText(/image/gi);

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('data-testid', 'node-0-1-0-0-0');
        const parent = screen.getByTestId('node-0-1-0-0');
        expect(parent).toHaveTextContent('Column');
    });

    test('should expand parent for matching children (matched in multiple section)', async () => {
        // Render the component with the valid props
        render(<NavTree search="col" />, {
            shortContext: { ...shortContext, currentPageInfo, symbols },
        });

        // first matched column in the document
        const col1 = screen.getByTestId('node-0-0-0-0');
        expect(col1).toBeInTheDocument();

        const row1 = screen.getByTestId('node-0-0-0');
        expect(row1.closest('.ant-tree-treenode')).toHaveClass(
            'ant-tree-treenode-switcher-open'
        );

        const section1 = screen.getByTestId('node-0-0');
        expect(section1.closest('.ant-tree-treenode')).toHaveClass(
            'ant-tree-treenode-switcher-open'
        );

        // second matched column in the document
        const col2 = screen.getByTestId('node-0-1-0-0');
        expect(col2).toHaveTextContent('Column');

        const row2 = screen.getByTestId('node-0-1-0');
        expect(row2.closest('.ant-tree-treenode')).toHaveClass(
            'ant-tree-treenode-switcher-open'
        );

        const section2 = screen.getByTestId('node-0-1');
        expect(section2.closest('.ant-tree-treenode')).toHaveClass(
            'ant-tree-treenode-switcher-open'
        );
    });

    test('calls showSettingsModal function when a tree node is selected when searched is applied', async () => {
        render(<NavTree search="title" />, {
            shortContext: { ...shortContext, currentPageInfo },
        });

        // Select the tree node
        const title = screen.getByText('Title');

        // Verify that the showSettingsModal function is called with the expected argument
        await userEvent.click(title);
        expect(mockShowSettingModal).toHaveBeenCalledWith(
            'COMPONENT_SETTINGS',
            '0.0.0.1',
            'NAVIGATION_TREE'
        );

        const row = screen.getByText('Row 1');

        await userEvent.click(row);
        expect(mockShowSettingModal).toHaveBeenCalledWith(
            'COMPONENT_SETTINGS',
            '0.0',
            'NAVIGATION_TREE'
        );
    });
});
