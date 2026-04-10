import { render, screen, userEvent, waitFor } from '@/util/test-utils.js';
import { inputData } from '../__mocks__/inputData';
import Input from './Input';

const mockOnChange = vi.fn();

const mockValidate = vi.fn(() => ({}));
const mockTrans = vi.fn((text) => text);

vi.mock('react-i18next', async (importActual) => {
    const actual = await importActual('react-i18next');
    return {
        ...actual,
        useTranslation: vi.fn(() => ({ t: mockTrans })),
    };
});

beforeEach(() => {
    vi.clearAllMocks();
});

describe('Input Fields', () => {
    it.each(['text', 'input', 'textarea'])(
        'render %s input properly with value',
        (prop) => {
            const inputProp = inputData[prop];
            render(
                <Input
                    {...inputProp}
                    onChange={mockOnChange}
                    value="Hello world value"
                />
            );
            // checking is rendering label of input (RenderComponentWithLabel)
            expect(screen.getByText(inputProp.label)).toBeInTheDocument();
            // checking is rendering input field with value
            expect(screen.getByTestId(inputProp.label).value).toBe(
                'Hello world value'
            );
        }
    );
    it.each(['text', 'input', 'textarea'])(
        '%s input value changing properly',
        async (prop) => {
            const inputProp = inputData[prop];
            render(<Input {...inputProp} onChange={mockOnChange} />);

            const inputField = await screen.findByTestId(`${prop}-input`);
            const inputValue = `hello ${prop}`;

            await userEvent.clear(inputField);
            inputField.focus();
            await userEvent.paste(inputValue);
            expect(inputField).toHaveValue(inputValue);
            await waitFor(() => {
                expect(mockOnChange).toHaveBeenCalledWith({
                    name: inputProp.name,
                    value: inputValue,
                });
            });
        }
    );

    it('validate function is working properly for text input', async () => {
        const inputProp = inputData['text'];
        mockValidate.mockReturnValue({
            valid: false,
            error: 'there is an error',
        });
        const { rerender } = render(
            <Input
                {...{
                    ...inputProp,
                    validate: mockValidate,
                    validateBeforeSaving: true,
                }}
                onChange={mockOnChange}
            />
        );

        const inputField = await screen.findByTestId(`text-input`);
        const inputValue = `hello text`;

        await userEvent.clear(inputField);
        inputField.focus();
        await userEvent.paste(inputValue);
        expect(inputField).toHaveValue(inputValue);
        expect(mockValidate).toHaveBeenCalledWith(inputValue, mockTrans);
        expect(screen.getByText('there is an error')).toBeInTheDocument();
        expect(mockOnChange).not.toHaveBeenCalled();

        mockValidate.mockReturnValue({
            valid: true,
        });
        rerender(
            <Input
                {...{
                    ...inputProp,
                    validate: mockValidate,
                    validateBeforeSaving: true,
                }}
                onChange={mockOnChange}
            />
        );

        await userEvent.clear(inputField);
        inputField.focus();
        await userEvent.paste(inputValue);
        expect(inputField).toHaveValue(inputValue);
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({
                name: 'label',
                value: inputValue,
            });
        });
    });

    it.each([
        { input: '178', result: '178' },
        { input: '327as343', result: '327' },
        { input: '324 12', result: '32412' },
    ])('number input value changing properly', async ({ input, result }) => {
        const inputProp = inputData['number'];
        render(<Input {...inputProp} onChange={mockOnChange} />);
        const inputField = screen.getByTestId(`number-input`);
        await userEvent.clear(inputField);
        await userEvent.type(inputField, input);
        expect(inputField).toHaveValue(input);
        await waitFor(() =>
            expect(mockOnChange).toHaveBeenLastCalledWith({
                name: inputProp.name,
                value: result,
            })
        );
    });
    it('time input value changing properly', async () => {
        const inputProp = inputData['time'];
        render(<Input {...inputProp} onChange={mockOnChange} />);
        const timeInput = screen.getByTestId('time-input');

        await userEvent.click(timeInput);
        await userEvent.clear(timeInput);
        await userEvent.type(timeInput, '00:10:07');
        expect(timeInput).toHaveValue('00:10:07');
        await userEvent.click(
            screen.getByRole('button', {
                name: /ok/i,
            })
        );
        expect(mockOnChange).toHaveBeenCalledWith({
            name: inputProp.name,
            value: '00:10:07',
        });
    });
    it('date input value changing properly', async () => {
        const inputProp = inputData['date'];
        render(<Input {...inputProp} onChange={mockOnChange} />);
        const dateInput = screen.getByTestId('date-input');

        await userEvent.click(dateInput);
        await userEvent.clear(dateInput);
        await userEvent.type(dateInput, '2023-09-19{enter}');
        expect(dateInput).toHaveValue('2023-09-19');
        await userEvent.tab();
        expect(mockOnChange).toHaveBeenCalledWith({
            name: inputProp.name,
            value: '2023-09-19',
        });
    });
    it('id input value changing properly', async () => {
        const inputProp = inputData['id'];
        render(<Input {...inputProp} onChange={mockOnChange} inputType="Id" />);
        const idInput = screen.getByTestId('id-input');
        await userEvent.clear(idInput);
        await userEvent.type(idInput, 'hello world dorik');
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith({
                name: inputProp.name,
                value: 'hello-world-dorik',
            });
        });
    });
    it('url input showing error when url invalid', async () => {
        const inputProp = inputData['url'];
        render(
            <Input {...inputProp} onChange={mockOnChange} inputType="URL" />
        );
        const urlInput = screen.getByTestId('url-input');
        await userEvent.clear(urlInput);
        await userEvent.type(urlInput, 'helloorlddorik');
        await waitFor(() => {
            expect(screen.getByText('The URL is invalid')).toBeInTheDocument();
        });
        await userEvent.clear(urlInput);
        await userEvent.type(urlInput, 'http:shelloorlddorik');
        await waitFor(() => {
            expect(screen.getByText('The URL is invalid')).toBeInTheDocument();
        });
        await userEvent.clear(urlInput);
        await userEvent.type(urlInput, 'https:shelloorlddorik');
        await waitFor(() => {
            expect(screen.getByText('The URL is invalid')).toBeInTheDocument();
        });
    });
    it('url input value changing properly', async () => {
        const inputProp = inputData['url'];
        render(
            <Input {...inputProp} onChange={mockOnChange} inputType="URL" />
        );
        const urlInput = await screen.findByTestId('url-input');
        await userEvent.clear(urlInput);
        await userEvent.type(urlInput, 'https://helloworld.dorik');
        await userEvent.tab();
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenLastCalledWith({
                name: inputProp.name,
                value: 'https://helloworld.dorik',
            });
        });
        expect(
            screen.queryByText('The URL is invalid')
        ).not.toBeInTheDocument();
    });
});
