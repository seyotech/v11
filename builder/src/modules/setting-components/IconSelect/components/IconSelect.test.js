import { fireEvent, render, screen } from 'util/test-utils';
import IconSelect from './IconSelect';
import { ICON_TYPES } from '../constants';

describe('IconSelect', () => {
    it("renders null when iconPack is 'none' or 'simple'", () => {
        const { rerender } = render(
            <IconSelect
                name="test"
                onChange={() => {}}
                value={{ visible: 'none' }}
            />
        );
        expect(screen.queryByTestId('icon-component')).toBeNull();

        rerender(
            <IconSelect
                name="test"
                onChange={() => {}}
                value={{ visible: 'simple' }}
            />
        );
        expect(screen.queryByTestId('icon-component')).toBeNull();
    });

    it('sets defaultIcon when value is not provided', () => {
        const onChange = vi.fn();
        const defaultIcon = {
            prefix: 'fas',
            type: 'font-awesome',
            iconName: 'file-alt',
        };

        render(
            <IconSelect
                name="test"
                onChange={onChange}
                defaultIcon={defaultIcon}
            />
        );

        expect(onChange).toHaveBeenCalledWith({
            name: 'test/icon',
            value: defaultIcon,
        });
    });

    it('renders and interacts correctly with FontAwesome icons', async () => {
        const onChange = vi.fn();
        const name = 'test';
        const value = {
            visible: ICON_TYPES.FONT_AWESOME,
            icon: {
                type: 'font-awesome',
                iconName: 'file-lines',
                prefix: 'far',
            },
        };

        render(<IconSelect onChange={onChange} name={name} value={value} />);
        let svg0 = screen.getByTestId('fa-trash-can');
        let svg1 = screen.getByTestId('fa-message');
        let svg2 = screen.getByTestId('fa-file-lines');

        expect(svg0).toBeInTheDocument();
        expect(svg1).toBeInTheDocument();
        expect(svg2).toBeInTheDocument();

        // to be selected
        expect(svg2).toHaveClass('selected');

        // not selected
        expect(svg1).not.toHaveClass('selected');

        // search
        const searchInput = screen.getByPlaceholderText('Search Icons');

        await fireEvent.change(searchInput, { target: { value: 'lines' } });
        svg0 = screen.queryByTestId('fa-trash-can');
        svg1 = screen.queryByTestId('fa-message');
        svg2 = screen.getAllByTestId('fa-file-lines')[0];

        // to be in the document
        expect(svg0).not.toBeInTheDocument();
        expect(svg1).not.toBeInTheDocument();

        // to be in the document
        expect(svg2).toBeInTheDocument();

        await fireEvent.change(searchInput, { target: { value: 'message' } });
        svg0 = screen.queryByTestId('fa-trash-can');
        svg1 = screen.getAllByTestId('fa-message')[0];
        svg2 = screen.queryByTestId('fa-file-lines');

        // to be in the document
        expect(svg0).not.toBeInTheDocument();
        expect(svg2).not.toBeInTheDocument();

        // to be in the document
        expect(svg1).toBeInTheDocument();

        await fireEvent.click(svg1);

        expect(onChange).toHaveBeenCalledWith({
            name: `${name}/icon`,
            value: { iconName: 'message', prefix: 'far', type: 'font-awesome' },
        });
    });

    it('renders and interacts correctly with Feather icons', async () => {
        const onChange = vi.fn();
        const name = 'test';
        const value = {
            visible: ICON_TYPES.FEATHER,
            icon: {
                type: 'feather',
                prefix: 'feather',
                iconName: 'alert-circle',
            },
        };

        render(<IconSelect onChange={onChange} name={name} value={value} />);
        let svg0 = screen.getByTestId('fi-activity');
        let svg1 = screen.getByTestId('fi-airplay');
        let svg2 = screen.getByTestId('fi-alert-circle');

        expect(svg0).toBeInTheDocument();
        expect(svg1).toBeInTheDocument();
        expect(svg2).toBeInTheDocument();

        // to be selected
        expect(svg2).toHaveClass('selected');

        // not selected
        expect(svg1).not.toHaveClass('selected');

        // search
        const searchInput = screen.getByPlaceholderText('Search Icons');

        await fireEvent.change(searchInput, { target: { value: 'circle' } });
        svg0 = screen.queryByTestId('fi-activity');
        svg1 = screen.queryByTestId('fi-airplay');
        svg2 = screen.getByTestId('fi-alert-circle');

        // to be in the document
        expect(svg0).not.toBeInTheDocument();
        expect(svg1).not.toBeInTheDocument();

        // to be in the document
        expect(svg2).toBeInTheDocument();

        await fireEvent.change(searchInput, { target: { value: 'airplay' } });
        svg0 = screen.queryByTestId('fi-activity');
        svg1 = screen.getByTestId('fi-airplay');
        svg2 = screen.queryByTestId('fi-alert-circle');

        // to be in the document
        expect(svg0).not.toBeInTheDocument();
        expect(svg2).not.toBeInTheDocument();

        // to be in the document
        expect(svg1).toBeInTheDocument();

        await fireEvent.click(svg1);
        expect(onChange).toHaveBeenCalledWith({
            name: `${name}/icon`,
            value: { iconName: 'airplay', prefix: 'feather', type: 'feather' },
        });
    });
});
