import { render, screen, fireEvent } from '../../util/test-utils';
import ShortcutList from './ShortcutList';

const closeMock = vi.fn();
const items = [
    {
        keywords: 'Cmd or Ctrl + S',
        text: 'Save Current Page',
        type: 'save',
    },
    {
        keywords: 'Cmd or Ctrl + Shift + P',
        text: 'Publish Site',
        type: 'publish',
    },
    {
        keywords: 'Cmd or Ctrl + Z',
        text: 'Undo Current Changes',
        type: 'undo',
    },
    {
        keywords: 'Cmd or Ctrl + Shift + Z',
        text: 'Redo Previous Changes',
        type: 'redo',
    },
    {
        keywords: 'Cmd or Ctrl + Shift + /',
        text: 'Shortcut Help',
        type: 'help',
    },
];

describe('ShortcutOptions Component', () => {
    test('should render the modal with the correct title', () => {
        render(<ShortcutList close={closeMock} />);
        expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    });

    test.each(items)(
        'should include keyword: $keywords with description $text',
        ({ type, text, keywords }) => {
            render(<ShortcutList close={closeMock} />);
            expect(screen.getByTestId(`${type}-shortcut`).textContent).toBe(
                keywords
            );
            expect(screen.getByText(text)).toBeInTheDocument();
        }
    );

    test('should close fn is called when the close button is clicked', async () => {
        render(<ShortcutList close={closeMock} />);
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(closeMock).toHaveBeenCalledTimes(1);
    });
});
