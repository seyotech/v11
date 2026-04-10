import { render, screen, userEvent } from 'util/test-utils';
import { Switch } from './Switch';

const mockOnChange = vi.fn();

const mockProps = {
    name: 'name',
    value: false,
    onValue: true,
    offValue: false,
    defaultValue: false,
    onChange: mockOnChange,
    // mutateOnChange,
    module: {
        info: 'help test',
        label: 'dynamic text',
    },
    enabled: true,
};

describe('Switch', () => {
    it('should render switch component', () => {
        render(<Switch {...mockProps} />);
        const switchBtn = screen.getByRole('switch');
        expect(switchBtn).toBeInTheDocument();
    });
    it('should render switch title', () => {
        render(<Switch {...mockProps} />);
        const title = screen.getByText('dynamic text');
        expect(title).toBeInTheDocument();
    });

    it('should switch on', async () => {
        render(<Switch {...mockProps} />);
        const switchBtn = screen.getByRole('switch');
        await userEvent.click(switchBtn);
        expect(mockOnChange).toHaveBeenCalledWith({
            name: 'name',
            value: true,
        });
    });
    it('should switch off', async () => {
        render(<Switch {...mockProps} value={true} defaultValue={true} />);
        const switchBtn = screen.getByRole('switch');
        await userEvent.click(switchBtn);
        expect(mockOnChange).toHaveBeenCalledWith({
            name: 'name',
            value: false,
        });
    });
});
