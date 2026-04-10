import SelectInput from './SelectInput';

const iconPacks = [
    { label: 'None', value: 'none' },
    { label: 'Font Awesome', value: 'font-awesome' },
    { label: 'Feather', value: 'feather' },
];

/**
 * Returns a SelectInput component for selecting an icon pack.
 * @param {Object} props - The props object containing the following properties:
 * @param {function} props.Onchange - A callback function to be called when the icon pack selection changes.
 * @param {string} props.name - The name of the icon pack input field.
 * @param {string} props.value - The current value of the icon pack input field.
 * @param {string} props.defaultValue - The default value of the icon pack input field.
 * @returns {JSX.Element} - The SelectInput component.
 */
export default function IconPackSelect(props) {
    const { onChange, name, value, defaultValue } = props;
    const changeIconPack = ({ value }) => {
        const iconPlace = name.replace('visible', 'icon');
        onChange([
            {
                name,
                value: value,
            },
            {
                name: iconPlace,
                value: null,
            },
        ]);
    };

    return (
        <SelectInput
            {...props}
            defaultValue={value ?? defaultValue}
            name={name}
            options={iconPacks}
            onChange={changeIconPack}
        />
    );
}
