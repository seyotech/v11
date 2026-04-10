import { render } from '@/util/test-utils';
import { Range } from 'modules/setting-components/Range';
import Size from './Size';

vi.mock('modules/setting-components/Range', async () => ({
    ...(await vi.importActual('modules/setting-components/Range')),
    Range: vi.fn((props) => {
        props.onChange({ name: props.name, value: props.value });
        return <p>Range</p>;
    }),
}));
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
    defaultValue: { height: '20px' },
    name: 'size',
    value: { height: '20px', width: '20px' },
    times: 3,
};

describe('Range', () => {
    it('should render mock range with proper props and onchange function properly ', async () => {
        render(<Size {...initialProps} onChange={mockOnChange} />);
        expect(Range).toHaveBeenCalledWith(
            expect.objectContaining({
                ...initialProps,
                module: { ...initialProps.module, defaultValue: '20px' },
                value: '20px',
            }),
            {}
        );

        expect(mockOnChange).toHaveBeenCalledWith({
            name: 'size',
            value: {
                height: '20px',
                width: '60px',
                'min-width': '60px',
            },
        });
    });
});
