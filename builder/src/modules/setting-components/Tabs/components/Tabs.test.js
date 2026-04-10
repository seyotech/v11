import { render, screen } from '@/util/test-utils.js';
import { fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';
const onChange = vi.fn();
const mutateOnChange = vi.fn();
const props = {
    name: 'tab',
    activeHover: false,
    hasError: true,
    errors: [],
    enabled: true,
    labelExtra: '',
};

describe('Tabs with label', () => {
    const options = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
    ];
    const module = {
        template: 'Tab',
        inputType: 'boxed',
        label: 'Alignment',
        isResponsible: false,
        defaultValue: 'center',
    };
    it('should render Tabs component correctly', () => {
        render(
            <Tabs
                name="tabsGroup"
                value="left"
                options={options}
                onChange={onChange}
                mutateOnChange={mutateOnChange}
                module={module}
                {...props}
            />
        );
        expect(
            screen.getAllByRole('radio', {
                name: /left || center || right/i,
            })
        ).toHaveLength(3);
    });
    it('should render with custom defaultValue when value is undefined', () => {
        render(
            <Tabs
                name="tabsGroup"
                options={options}
                defaultValue="left"
                onChange={onChange}
                module={module}
                {...props}
            />
        );
        const selectedTab = screen.getByRole('radio', {
            name: /Left/i,
        });
        expect(selectedTab).toBeChecked();
    });
    it('should render correctly with empty options array', () => {
        render(
            <Tabs
                name="tabs"
                value="left"
                options={[]}
                module={module}
                {...props}
            />
        );
        expect(screen.queryByRole('radio')).not.toBeInTheDocument();
        expect(screen.queryAllByRole('radio')).toHaveLength(0);
    });
    it('should call onChange function with name and value when a tab is selected', async () => {
        render(
            <Tabs
                options={options}
                onChange={onChange}
                module={module}
                {...props}
            />
        );

        fireEvent.click(
            screen.getByRole('radio', {
                name: /Left/i,
            })
        );
        expect(onChange).toHaveBeenCalledWith({
            name: 'tab',
            value: 'left',
        });
        fireEvent.click(
            screen.getByRole('radio', {
                name: /Right/i,
            })
        );
        expect(onChange).toHaveBeenCalledWith({
            name: 'tab',
            value: 'right',
        });
        fireEvent.click(
            screen.getByRole('radio', {
                name: /Center/i,
            })
        );
        expect(onChange).toHaveBeenCalledWith({
            name: 'tab',
            value: 'center',
        });
    });
});
describe('Tabs with icon', () => {
    const optionsIcon = [
        { value: 'left', icon: 'far align-left' },
        { value: 'center', icon: 'far align-center' },
        { value: 'right', icon: 'far align-right' },
    ];
    const module = {
        template: 'Tab',
        inputType: 'boxed',
        label: 'Alignment',
        isResponsible: false,
        defaultValue: 'center',
    };
    it('should render Tabs component correctly', () => {
        render(
            <Tabs
                name="tabsGroup"
                value="left"
                options={optionsIcon}
                onChange={onChange}
                mutateOnChange={mutateOnChange}
                module={module}
                {...props}
            />
        );

        expect(screen.getAllByRole('radio')).toHaveLength(3);
        // const tabIcons = screen.getAllByTestId('tab-icons');
        // expect(tabIcons).toHaveLength(3);
    });
});
