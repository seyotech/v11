import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Menu, Button, Dropdown, Spin, Tooltip } from 'antd';

import { useRenderFields } from './utils';
import useCMSRow from '../../../hooks/useCmsRow';
import { getDropdownItems } from '../../../util/getDropdownItems';
import { EditorContext } from '../../../contexts/ElementRenderContext';
import { fieldTypesEnum } from 'util/fieldTypes';
import { createGlobalStyle } from 'styled-components';

import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { antToken } from '../../../antd.theme';
import { useTranslation } from 'react-i18next';
import useGetCMSConfig from '../../../hooks/useCmsRow/useGetCMSConfig';
const DropdownGlobalStc = createGlobalStyle`
      .add-cms-field-dropdown .ant-dropdown-menu, .add-cms-field-dropdown-sub-menu .ant-dropdown-menu  {
        max-height: 320px; //max total 10 number of fields height
        overflow-y: auto;
    }
`;

const skipAbleRefs = ['SEARCH'];

export const iconStyles = {
    fontSize: 14,
    cursor: 'pointer',
    color: antToken.colorLink,
};

function DropdownInput(props) {
    const {
        name,
        children,
        onChange,
        value = '',
        disabled,
        cmsFields = [],
        style = {},
        customMenuClick,
        ...restProps
    } = props;

    const { cmsRowAddr } = useCMSRow();
    const { page: { ref } = {} } = useContext(EditorContext);
    const { t } = useTranslation('builder');
    const { selectedField } = useGetCMSConfig();
    const { fields = [], handleSingleRefData } = useRenderFields(
        cmsFields,
        selectedField
    );

    const items = useMemo(() => {
        const filteredFields = fields.map((field) => {
            if (field.codes) {
                return {
                    ...field,
                    codes: field.codes.filter(
                        ({ type }) =>
                            ![
                                fieldTypesEnum.MULTI_REFERENCE,
                                fieldTypesEnum.SINGLE_REFERENCE,
                            ].includes(type)
                    ),
                };
            }
            return field;
        });

        return getDropdownItems(filteredFields);
    }, [fields]);

    const handleMenuClick = useCallback(
        ({ key }) => {
            const item = key
                .split('+')
                .reduce(
                    (items, itemIndex) =>
                        items.codes ? items.codes[itemIndex] : items[itemIndex],
                    fields
                );
            if (customMenuClick && typeof customMenuClick === 'function') {
                return customMenuClick({ name, value, code: item.code });
            }
            let newValue = value.concat(item.code);
            if (item.type === 'IMAGE') {
                newValue = item.code;
            }

            onChange({ name, value: newValue });
        },
        [fields, onChange, name, value]
    );

    const menu = (
        <Menu
            items={items}
            onClick={handleMenuClick}
            onOpenChange={([singleRefKey = '']) => {
                const [, refTopic] = singleRefKey.split('+');
                if (refTopic) {
                    handleSingleRefData({
                        refTopic,
                    });
                }
            }}
        />
    );

    //need to update this condition in next
    if (!cmsRowAddr && (!ref || skipAbleRefs.includes(ref))) return null;

    return (
        <>
            <DropdownGlobalStc />
            <Dropdown
                overlay={menu}
                disabled={disabled}
                overlayClassName="add-cms-field-dropdown"
                trigger={['click']}
            >
                <Tooltip placement="topLeft" title={t('Add CMS Field')}>
                    <Button
                        style={{
                            fontSize: 14,
                            cursor: 'pointer',
                            ...style,
                        }}
                        type="text"
                        size="small"
                        {...restProps}
                        data-testid="cms-dropdown-btn"
                    >
                        {children || (
                            <FontAwesomeIcon
                                style={iconStyles}
                                icon={icon({
                                    name: 'database',
                                    type: 'regular',
                                })}
                            />
                        )}
                    </Button>
                </Tooltip>
            </Dropdown>
        </>
    );
}

export default DropdownInput;
