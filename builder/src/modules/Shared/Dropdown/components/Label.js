import { antToken } from '../../../../antd.theme';

/**
 * Represents the Dropdown Label.
 * This component is responsible for displaying dropdown item label.
 *
 * @param {object} props - The props for the Label component.
 * @param {string} props.label - The content to show as a label to the dropdown item.
 * @param {boolean} props.danger - The indicator to show it is a dangerous action or not
 * @param {boolean} props.disabled - Indicate that is item is disabled
 *
 * @returns {JSX.Element} The rendered Label component.
 *
 * @example
 * <Label
 *    danger
 *    label="Edit"
 * />
 */
export const Label = ({ label, danger, disabled }) => {
    return (
        <span
            style={{
                fontSize: 14,
                lineHeight: '22px',
                ...(!(danger || disabled) ? { color: antToken.colorText } : {}),
            }}
        >
            {label}
        </span>
    );
};
