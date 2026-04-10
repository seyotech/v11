/*****************************************************
 * Packages
 ******************************************************/

import { Range } from 'modules/setting-components/Range';

/*****************************************************
 * Local
 ******************************************************/
// import { Range } from 'modules/setting-components/Range';

const Size = (props) => {
    const { value, defaultValue, onChange, name, module, times } = props;

    const handleChange = ({ value }) => {
        const calCulatedValue = value.replace(
            /(\d+)([a-zA-Z]+)/,
            (_, number, unit) => {
                return parseInt(number) * times + unit;
            }
        );
        onChange({
            name,
            value: {
                height: value,
                width: calCulatedValue,
                'min-width': calCulatedValue,
            },
        });
    };

    return (
        <Range
            {...props}
            module={{ ...module, defaultValue: defaultValue?.height }}
            value={value?.height}
            onChange={handleChange}
        />
    );
};

export default Size;
