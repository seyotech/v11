import { render, screen, userEvent } from '@/util/test-utils';
import Title from './TreeTitle';

const initialProps = {
    item: {
        address: '123',
        title: 'Test Title',
        options: {},
    },
    handleContextMenu: vi.fn(),
    handleNodeKeyOnDropDown: vi.fn(),
};

describe('Title', () => {
    const item = {
        address: '123',
        title: 'Test Title',
        options: {},
    };

    it('should render the title correctly', () => {
        render(<Title {...initialProps} />);
        const titleElement = screen.getByTestId('node-123');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveTextContent('Test Title');
    });

    it('should handle context menu correctly', async () => {
        const handleContextMenu = vi.fn();
        render(
            <Title
                {...initialProps}
                handleContextMenu={handleContextMenu}
                type="navTree"
            />
        );

        const titleElement = screen.getByText('Test Title');
        await userEvent.hover(titleElement);
        await userEvent.click(screen.getByRole('button'));
        expect(handleContextMenu).toHaveBeenCalledWith(
            expect.objectContaining({ node: { key: '123' } })
        );
    });

    it('should not display button by default', () => {
        render(<Title {...initialProps} />);
        const buttonElement = screen.queryByRole('button');

        expect(buttonElement).not.toBeInTheDocument();
    });

    it('should display button on hover', async () => {
        render(<Title {...initialProps} />);

        const titleElement = screen.getByText('Test Title');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        await userEvent.hover(titleElement);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it.each([
        // 'pageSettings',
        'addPage',
        'duplicate',
        'setAsHomepage',
        'pageNameSlug',
        'deletePage',
    ])('%s icon should be in document', async (testId) => {
        render(<Title {...initialProps} type="pageTree" />);

        const titleElement = screen.getByText('Test Title');
        await userEvent.hover(titleElement);
        await userEvent.click(screen.queryByRole('button'));
        const icon = screen.getByTestId(testId);
        expect(icon).toBeInTheDocument();
    });
});
