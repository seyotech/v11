import { render, screen, userEvent } from '@/util/test-utils.js';
import SelectInput from './SelectInput';

const onChange = vi.fn();

describe('SelectInput', () => {
    it('should trigger onChange event when an option is selected', async () => {
        render(
            <SelectInput
                name="select"
                value="option1"
                options={[
                    { name: 'Option 1', value: 'option1' },
                    { name: 'Option 2', value: 'option2' },
                    { name: 'Option 3', value: 'option3' },
                ]}
                module={{ label: 'label' }}
                hasError={true}
                enabled={true}
                onChange={onChange}
            />
        );
        expect(screen.getByRole('combobox')).toHaveValue('option1');
        await userEvent.selectOptions(screen.getByRole('combobox'), [
            'option2',
        ]);
        expect(onChange).toBeCalledWith({
            name: 'select',
            value: 'option2',
        });
    });

    it("should show the placeholder 'Select..' if placeholder is not coming from props", async () => {
        render(
            <SelectInput
                name="select"
                options={[
                    { name: 'None', value: 'none' },
                    { name: 'Option 2', value: 'option2' },
                    { name: 'Option 3', value: 'option3' },
                ]}
                module={{ label: 'label' }}
                hasError={true}
                enabled={true}
                onChange={onChange}
                label="Country"
            />
        );
        expect(screen.getByRole('combobox')).toHaveAttribute(
            'placeholder',
            'Select..'
        );
    });
});
