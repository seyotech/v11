import {
    fireEvent,
    render,
    screen,
    userEvent,
    waitFor,
} from '@/util/test-utils';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import Range from './Range';

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
    module: {
        defaultUnit: 'px',
        min: 0,
        max: 200,
    },
    name: 'range',
    value: '100px',
    onChange: mockOnChange,
};

describe('Range', () => {
    it('should render slider and input number will incoming data correctly ', async () => {
        render(
            <Range {...initialProps} value="20px" {...initialProps.module} />
        );
        const sliderInput = screen.getByRole('slider');
        const inputNumber = screen.getByRole('spinbutton');
        expect(sliderInput).toBeInTheDocument();
        expect(sliderInput).toHaveAttribute('aria-valuenow', '20');
        expect(sliderInput).toHaveAttribute('aria-valuemin', '0');
        expect(sliderInput).toHaveAttribute('aria-valuemax', '200');
        expect(inputNumber).toBeInTheDocument();
        expect(inputNumber).toHaveAttribute('aria-valuenow', '20');
        expect(inputNumber).toHaveValue('20');
    });

    it.each(['px', 'rem', 'em'])('unit %s', async (unit) => {
        const defaultValue = '50px';
        render(
            <Range
                {...initialProps}
                defaultValue={defaultValue}
                module={{ defaultUnit: unit }}
                value={`100${unit}`}
            />
        );
        const sliderInput = screen.getByRole('slider');
        await userEvent.hover(sliderInput);
        await waitFor(() => {
            expect(
                screen.getByRole('tooltip', { name: `100${unit}` })
            ).toBeInTheDocument();
        });
        const inputNumber = screen.getByRole('spinbutton');
        expect(inputNumber).toHaveValue(`100`);
        await fireEvent.change(inputNumber, {
            target: {
                value: '30',
            },
        });
        expect(mockOnChange).toHaveBeenLastCalledWith({
            name: 'range',
            value: `30${unit}`,
        });
        await fireEvent.change(inputNumber, {
            target: {
                value: '',
            },
        });

        expect(mockOnChange).toHaveBeenLastCalledWith({
            name: 'range',
            value: '',
        });

        // await userEvent.click(sliderInput, { deltaX: 80 });
        // // fireEvent.mouseDown(sliderInput);
        // // fireEvent.mouseMove(sliderInput, { clientX: 150 }); // Adjust clientX as needed
        // // fireEvent.mouseUp(sliderInput);
        // await waitFor(() => {
        //     expect(sliderInput).toHaveAttribute('aria-valuenow', '80');
        // });
    });

    it('should take unit associated to value rather than defaultUnit', async () => {
        render(
            <Range
                {...initialProps}
                module={{ defaultUnit: 'rem' }}
                value={`100px`}
            />
        );
        const sliderInput = screen.getByRole('slider');
        await userEvent.hover(sliderInput);
        await waitFor(() => {
            expect(
                screen.getByRole('tooltip', { name: `100px` })
            ).toBeInTheDocument();
        });
        const inputNumber = screen.getByRole('spinbutton');
        expect(inputNumber).toHaveValue(`100`);
    });

    it('should not pass labelPosition data to renderComponentWithLAbel component', async (unit) => {
        render(
            <Range
                {...initialProps}
                module={{ defaultUnit: 'rem', labelPosition: 'inline' }}
                value={`100px`}
            />
        );
        expect(RenderComponentWithLabel).toHaveBeenCalledWith(
            expect.objectContaining({ module: { defaultUnit: 'rem' } }),
            {}
        );
    });

    it("should placeholder text be shown on input number and slider tooltip when value is ''", async (unit) => {
        const placeholder = 'auto';
        const { rerender } = render(
            <Range
                {...initialProps}
                module={{
                    defaultUnit: 'rem',
                    labelPosition: 'inline',
                }}
                placeholder={placeholder}
                value={''}
            />
        );
        await checkInputNumberAndSlider({ value: '', placeholder });
        rerender(
            <Range
                {...initialProps}
                module={{
                    defaultUnit: 'rem',
                    labelPosition: 'inline',
                }}
                placeholder={placeholder}
                value={'%'}
            />
        );
        await checkInputNumberAndSlider({ value: '', placeholder });
        rerender(
            <Range
                {...initialProps}
                module={{
                    defaultUnit: 'rem',
                    labelPosition: 'inline',
                }}
                placeholder={placeholder}
                value={'axjkajss'}
            />
        );
        await checkInputNumberAndSlider({ value: '', placeholder });
    });
});

const checkInputNumberAndSlider = async ({ value, placeholder }) => {
    const sliderInput = screen.getByRole('slider');
    await userEvent.hover(sliderInput);
    await waitFor(() => {
        expect(
            screen.getByRole('tooltip', { name: placeholder })
        ).toBeInTheDocument();
    });
    const inputNumber = screen.getByRole('spinbutton');
    expect(inputNumber).toHaveAttribute('placeholder', placeholder);
    expect(inputNumber).toHaveValue(value);
};
