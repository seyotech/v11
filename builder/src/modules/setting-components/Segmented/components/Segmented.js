/*****************************************************
 * Packages
 ******************************************************/
import { Segmented as AntSegmented } from 'antd';
import styled from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import { useTranslation } from 'react-i18next';

const SegmentedStc = styled.div`
    --count: ${({ count = 2 }) => count};

    & .ant-segmented {
        width: 100%;

        &-group {
            display: grid;
            grid-template-columns: repeat(var(--count), 1fr);
            & label {
                width: 100%;
            }
        }
    }
`;

/**
 * Represents a segmented control component.
 * This component renders a segmented control with a label and options.
 * It allows the user to select one option from the available options.
 *
 * @param {Object} props - The props for configuring the segmented control.
 * @param {string} props.name - The name of the segmented control.
 * @param {string} props.value - The current selected value of the segmented control.
 * @param {Array} props.options - The available options for the segmented control.
 * @param {function} props.onChange - The callback function to be called when the value of the segmented control changes.
 * @param {string} [props.defaultValue] - The default value for the segmented control.
 * @returns {JSX.Element} - The rendered segmented control component.
 * @throws {Error} - If the props argument is not provided.
 *
 * @example
 * // Example usage of the `Segmented` component
 * <Segmented
 *     name="gender"
 *     value="female"
 *     options={[{name: 'Male', value: 'male'}, {name: 'Female', value: 'female'}]}
 *     onChange={handleOnChange}
 *     defaultValue="male"
 * />
 */
export const Segmented = (props) => {
    const { t } = useTranslation('builder');
    const { name, value, options, onChange, defaultValue } = props;
    const transOpts = options.map((opt) => {
        return { ...opt, label: t(opt.label) };
    });
    const handleOnChange = (value) => {
        onChange({ name, value });
    };
    return (
        <RenderComponentWithLabel {...props}>
            <SegmentedStc count={options.length}>
                <AntSegmented
                    size="small"
                    value={value}
                    options={transOpts}
                    onChange={handleOnChange}
                    defaultValue={defaultValue}
                />
            </SegmentedStc>
        </RenderComponentWithLabel>
    );
};
