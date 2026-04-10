/* eslint-disable prettier/prettier */
import { Dropdown as AntDropdown, Space, Tooltip } from 'antd';
import { DropdownGlobalStc } from './Dropdown.stc';
import { Icon } from './Icon';
import { Label } from './Label';

/**
 * Represents a Dropdown component.
 * This component is responsible for displaying a custom dropdown.
 *
 * @typedef {Object} DropdownItem
 * @property {number} key - A unique identifier for the option.
 * @property {string} label - The text label for the option.
 * @property {string} [tooltip] - An optional tooltip for the option.
 * @property {function} [onClick] - An onClick handler of the option.
 * @property {boolean} [danger=false] - The dangerous indicator of the handler of the option.
 * @property {React.ReactElement} [prefix] - The React element representing prefix positioned ahead of label.
 *
 * @param {Object} props - The props for the Dropdown component.
 * @param {JSX.Element} props.children - The content to display within the dropdown.
 * @param {DropdownItem[]} props.options - An array of DropdownItem objects representing the options for the dropdown.
 * @param {number} [props.width] - The optional width of the dropdown component.
 * @param {string} [props.className] - The optional className of the dropdown component.
 * @param {Array<string>} [props.selectedKeys] - The optional selected items of the dropdown component.
 *
 * @returns {JSX.Element} The rendered Dropdown component.
 *
 * @example
 * <Dropdown
 *    width={260}
 *    options={[
 *      { key: 1, label: 'Hello', tooltip: 'Nice' },
 *      { key: 2, label: 'World', tooltip: 'Awesome',onClick: ()=>{ // handle on click login } }
 *    ]}
 * >
 *  <button>Open dropdown</button>
 * </Dropdown>
 *
 */
export const Dropdown = ({
    children,
    options,
    selectedKeys = [],
    width,
    arrow = false,
    placement = 'bottomLeft',
    className,
    popupContainer,
}) => {
    const items = generateDropdownItems(options);

    return (
        <>
            <AntDropdown
                placement={placement}
                rootClassName={className}
                getPopupContainer={() => popupContainer || document.body}
                trigger={['click']}
                arrow={arrow}
                menu={{
                    items: items,
                    selectable: true,
                    defaultSelectedKeys: ['0'],
                    selectedKeys,
                    onMouseDown: (event) =>
                        popupContainer && event.preventDefault(),
                    style: {
                        width,
                        padding: 4,
                        borderRadius: '8px',
                    },
                }}
            >
                {children}
            </AntDropdown>
            <DropdownGlobalStc />
        </>
    );
};

/**
 * Generates an array of dropdown items based on the provided options.
 *
 * @param {Array} options - An array of options from which to generate the dropdown items.
 *
 * @returns {Array} An array of dropdown items.
 *
 * @example
 *
 * const options = [
 *    { label: 'Option 1', icon: icon({name:"link",}), tooltip: 'Tooltip for option 1' },
 *    { label: 'Option 2', icon: icon({name:'trash'}), tooltip: 'Tooltip for option 2' },
 * ];
 *
 * const dropdownItems = generateDropdownItems(options);
 *
 */

const generateDropdownItems = (options = []) => {
    return options.reduce(
        (items, { label, icon, prefix, tooltip, children, ...rest }) => {
            if (Array.isArray(children)) {
                children = generateDropdownItems(children);
            }
            if (label || icon) {
                label = (
                    <Tooltip title={tooltip} placement="right">
                        <Space size={8} style={{ width: '100%' }}>
                            {icon && <Icon {...rest} icon={icon} />}
                            {prefix && prefix}
                            {label && <Label {...rest} label={label} />}
                        </Space>
                    </Tooltip>
                );
            }
            return [...items, { ...rest, label, children }];
        },
        []
    );
};
