import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { antToken } from '../../../../antd.theme';

/**
 * Represents the Dropdown Icon.
 * This component is responsible for displaying dropdown item Icon.
 *
 * @param {object} props - The props for the Label component.
 * @param {string} props.icon - The Icon of the dropdown item.
 * @param {boolean} props.danger - The indicator to show it is a dangerous action or not
 * @param {boolean} props.disabled - Indicate that is item is disabled
 *
 * @returns {JSX.Element} The rendered Icon component.
 *
 * @example
 * <Icon
 *    danger
 *    icon={icon({name:'cog', type:'regular'})}
 * />
 */

export const Icon = ({ icon, danger, disabled }) => {
    return (
        <FontAwesomeIcon
            icon={icon}
            style={{
                ...(danger || disabled
                    ? {}
                    : { color: antToken.colorTextTertiary }),
            }}
        />
    );
};
