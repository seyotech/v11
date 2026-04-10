import { fireEvent, render, screen, within } from '@/util/test-utils';
import Spacing from './Spacing';

vi.mock(
    'modules/Shared/settings-components/RenderComponentWithLabel',
    async () => ({
        ...(await vi.importActual(
            'modules/Shared/settings-components/RenderComponentWithLabel'
        )),
        default: vi.fn(({ labelExtra, children }) => {
            return (
                <>
                    {labelExtra}
                    {children}
                </>
            );
        }),
    })
);
beforeEach(() => {
    vi.clearAllMocks();
});

const mockOnChange = vi.fn();

const initialProps = {
    name: 'spacing',
    value: [
        ['top', '10px'],
        ['bottom', '11px'],
        ['left', '12px'],
        ['right', '13px'],
    ],
    options: [
        { label: 'Top', name: 'top' },
        { label: 'Bottom', name: 'bottom' },
        { label: 'Left', name: 'left' },
        { label: 'Right', name: 'right' },
    ],
    onChange: mockOnChange,
};

describe('Spacing', () => {
    it('should render input fields and lock button correctly ', async () => {
        render(<Spacing {...initialProps} />);
        const topContainer = screen.getByTestId('top');
        expect(within(topContainer).getByRole('spinbutton')).toHaveValue('10');
        expect(within(topContainer).getByText('Top')).toBeInTheDocument();
        const bottomContainer = screen.getByTestId('bottom');
        expect(within(bottomContainer).getByRole('spinbutton')).toHaveValue(
            '11'
        );
        expect(within(bottomContainer).getByText('Bottom')).toBeInTheDocument();
        const leftContainer = screen.getByTestId('left');
        expect(within(leftContainer).getByRole('spinbutton')).toHaveValue('12');
        expect(within(leftContainer).getByText('Left')).toBeInTheDocument();
        const rightContainer = screen.getByTestId('right');
        expect(within(rightContainer).getByRole('spinbutton')).toHaveValue(
            '13'
        );
        expect(within(rightContainer).getByText('Right')).toBeInTheDocument();
        const lockIcon = within(screen.getByTestId('lock-button')).getByTestId(
            'lock-icon'
        );
        expect(lockIcon).toHaveClass('svg-inline--fa fa-lock');
        expect(lockIcon).toHaveAttribute('data-prefix', 'far');
        expect(lockIcon).not.toHaveAttribute(
            'style',
            'color: rgb(56, 48, 179);'
        );
    });

    it('should work functionality before and after locking', async () => {
        render(<Spacing {...initialProps} />);

        const bottomInput = within(screen.getByTestId('bottom')).getByRole(
            'spinbutton'
        );
        const leftInput = within(screen.getByTestId('left')).getByRole(
            'spinbutton'
        );

        const lockButton = screen.getByTestId('lock-button');

        //lastChanged
        fireEvent.change(bottomInput, { target: { value: '50' } });
        expect(mockOnChange).toHaveBeenCalledWith({
            name: 'spacing',
            value: [
                ['top', '10px'],
                ['bottom', '50px'],
                ['left', '12px'],
                ['right', '13px'],
            ],
        });

        //tooltip test of lock button
        fireEvent.mouseOver(lockButton);
        expect(
            await screen.findByRole('tooltip', { name: 'Sync Values' })
        ).toBeInTheDocument();

        //activating the lock
        fireEvent.click(lockButton);
        const lockIcon = within(lockButton).getByTestId('lock-icon');
        expect(lockIcon).toHaveAttribute('data-prefix', 'fas');
        expect(lockIcon).toHaveAttribute('style', 'color: rgb(56, 48, 179);');
        //taking the lastChanged value
        expect(mockOnChange).toHaveBeenCalledWith({
            name: 'spacing',
            value: [
                ['top', '50px'],
                ['bottom', '50px'],
                ['left', '50px'],
                ['right', '50px'],
            ],
        });
        fireEvent.change(leftInput, { target: { value: '30' } });
        expect(mockOnChange).toHaveBeenCalledWith({
            name: 'spacing',
            value: [
                ['top', '30px'],
                ['bottom', '30px'],
                ['left', '30px'],
                ['right', '30px'],
            ],
        });
    });
});
