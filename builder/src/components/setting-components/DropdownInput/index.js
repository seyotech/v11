import React, { useContext } from 'react';

import Label from '../Label/Label';
import { Menu, Button, Dropdown, List, Tooltip } from 'antd';
import { EditorContext } from '../../../contexts/ElementRenderContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const skipAbleRefs = ['SEARCH'];

function DropdownInput({
    addOptions,
    onChange,
    value,
    name,
    label,
    info,
    fieldType,
    shouldConcate = true,
}) {
    const { placeholders } = {};
    const { page } = useContext(EditorContext);
    const handleMenuClick = (code) => {
        let val = shouldConcate ? value + code : code;
        onChange({ name, value: val });
    };
    const menu = (
        <Menu>
            {placeholders &&
                placeholders
                    .filter(({ type }) => type === fieldType)
                    .map((field) => (
                        <Menu.Item
                            key={field.key}
                            onClick={() => handleMenuClick(field.code)}
                        >
                            {field.name}
                        </Menu.Item>
                    ))}
        </Menu>
    );

    if (!addOptions || !page?.ref || skipAbleRefs.includes(page.ref))
        return null;

    return (
        <List.Item style={{ margin: 0 }}>
            <Label>
                {label}{' '}
                {page?.ref && (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button size="small" type="primary">
                            Add CMS Fields
                        </Button>
                    </Dropdown>
                )}
            </Label>
            {info && (
                <Tooltip placement="top-left" title={info}>
                    <FontAwesomeIcon fixedWidth icon={['fas', 'info-circle']} />
                </Tooltip>
            )}
        </List.Item>
    );
}

export default DropdownInput;
