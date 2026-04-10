/*****************************************************
 * Packages
 ******************************************************/
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'antd';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/*****************************************************
 * Locals
 ******************************************************/
import IconFilter, { Option } from '../reusable/IconFilter';

library.add(fas);
library.add(fab);
library.add(far);

const Icon = styled.span`
    font-size: 16px;
    svg {
        width: 0.875em;
    }
`;

export default function FontAwesomeIcons({ onChange, name, value }) {
    const [filter, setFilter] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [totalVisibleIcons, setTotalVisibleIcons] = useState(56);

    const allFaIcons = Object.values(far)
        .concat(Object.values(fas))
        .concat(Object.values(fab))
        .filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    (t) =>
                        t.iconName === value.iconName &&
                        t.prefix === value.prefix
                )
        )
        .map((icon) => ({
            prefix: icon.prefix,
            iconName: icon.iconName,
            type: 'font-awesome',
        }));

    const iconList = allFaIcons
        .filter((icon) => icon.iconName.includes(filter))
        .filter((icon) => icon.iconName !== 'font-awesome-logo-full');

    const renderIconList = useMemo(
        () =>
            [null, ...iconList]
                .map(
                    (icon, ind) =>
                        icon && (
                            <Option isIcon value={icon} key={ind}>
                                <Icon>
                                    <FontAwesomeIcon
                                        icon={[icon.prefix, icon.iconName]}
                                    />
                                </Icon>
                            </Option>
                        )
                )
                .slice(0, totalVisibleIcons),
        [iconList, totalVisibleIcons]
    );

    const handleFilter = useCallback(
        debounce((payload) => {
            setFilter(payload.value.toLowerCase());
        }, 300),
        []
    );

    const loadMore = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setTotalVisibleIcons(iconList.length);
            setLoading(false);
        });
    }, [iconList.length]);

    return (
        <IconFilter
            cols="8"
            name={name}
            value={value}
            onSelect={onChange}
            onFilter={handleFilter}
            placeholder="Search for Icon"
        >
            {renderIconList}
            {iconList.length > Number(totalVisibleIcons) && (
                <Button
                    type="link"
                    onClick={loadMore}
                    style={{ width: '100%', color: '#0863ff' }}
                >
                    {isLoading ? (
                        <FontAwesomeIcon
                            spin
                            fixedWidth
                            icon={['far', 'spinner']}
                        />
                    ) : (
                        '+'
                    )}{' '}
                    Load all icons
                </Button>
            )}
        </IconFilter>
    );
}
