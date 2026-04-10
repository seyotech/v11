import { render, screen, userEvent } from '@/util/test-utils.js';
import items from './__mocks__/items';
import AntCollapse from './index';

describe('AntCollapse component', () => {
    it('should render the expand icon for default active panel 1', () => {
        render(<AntCollapse items={items} defaultActiveKey={['1']} />);
        const button = screen.getByRole('button', {
            name: 'This is panel header 1',
        });
        expect(button).toHaveAttribute('aria-expanded', 'true');
    });
    it('should expand the collapse on click', async () => {
        render(<AntCollapse items={items} defaultActiveKey={['1']} />);
        const regexPattern = new RegExp('This is panel header 2');
        const button = screen.getByRole('button', {
            name: regexPattern,
        });
        await userEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should collapse the collapse on click', async () => {
        render(<AntCollapse items={items} defaultActiveKey={['1']} />);
        const regexPattern = new RegExp('This is panel header 2');
        const button = screen.getByRole('button', {
            name: regexPattern,
        });
        await userEvent.click(button);
        await userEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should expanding and collapsing all the panels work properly', async () => {
        render(<AntCollapse items={items} defaultActiveKey={['1']} />);

        const button1 = screen.getByRole('button', {
            name: 'This is panel header 1',
        });
        const button2 = screen.getByRole('button', {
            name: 'This is panel header 2',
        });
        const button3 = screen.getByRole('button', {
            name: 'This is panel header 3',
        });
        //expand test
        await userEvent.click(button2);
        await userEvent.click(button3);
        expect(button2).toHaveAttribute('aria-expanded', 'true');
        expect(button3).toHaveAttribute('aria-expanded', 'true');
        expect(button1).toHaveAttribute('aria-expanded', 'true');
        //collapse test
        await userEvent.click(button1);
        await userEvent.click(button2);
        await userEvent.click(button3);
        expect(button2).toHaveAttribute('aria-expanded', 'false');
        expect(button3).toHaveAttribute('aria-expanded', 'false');
        expect(button1).toHaveAttribute('aria-expanded', 'false');
    });
});
