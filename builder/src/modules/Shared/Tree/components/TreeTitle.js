import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown, Typography } from 'antd';
import useClickOutside from 'hooks/useClickOutside';
import usePageActions from 'modules/Page/hooks/usePageActions';
import T from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { pageDropdownItems } from '../../../Page/utils/pageDropdownItems';
import BaseModal from '../../Modals/components';

const Container = styled.div`
    display: flex;
    padding: 2px 0;
    align-items: center;
    white-space: nowrap;
    justify-content: space-between;
`;

const TreeTitle = ({
    item,
    handleContextMenu,
    type,
    handleNodeKeyOnDropDown,
}) => {
    const { t } = useTranslation('builder');
    const [isBtnVisible, setIsBtnVisible] = useState(false);
    const { handlers, modal } = usePageActions({ item });

    useEffect(() => {
        setIsBtnVisible(item.isDropDownActive);
    }, [item.isDropDownActive]);

    return (
        <Container
            onMouseOver={() =>
                setIsBtnVisible(item.title.toLowerCase() !== 'unknown')
            }
            onMouseLeave={() => {
                setIsBtnVisible(item.isDropDownActive);
            }}
        >
            <Typography.Text
                ellipsis
                className="title"
                title={item.title}
                style={{ maxWidth: 160 }}
                data-testid={`node-${item.address}`}
            >
                {t(item.title)}
            </Typography.Text>
            {isBtnVisible && (
                <TitleBtn
                    t={t}
                    item={item}
                    type={type}
                    handleContextMenu={handleContextMenu}
                    data-testid={`setingsButton-${item.address}`}
                    handlers={handlers}
                    handleNodeKeyOnDropDown={handleNodeKeyOnDropDown}
                />
            )}
            <BaseModal {...modal} />
        </Container>
    );
};

const TitleBtn = ({
    handleNodeKeyOnDropDown,
    handleContextMenu,
    item,
    type,
    pageSlugSettings,
    t,
    handlers,
    ...rest
}) => {
    const menuProps = {
        items: pageDropdownItems({
            pageSlugSettings,
            style: {
                height: '32px',
                padding: '5px 12px',
                fontSize: '14px',
                lineHeight: '22px',
            },
            handlers,
            options: item.options,
            t,
        }),
        style: {
            width: '192px',
            marginLeft: '12px',
            borderRadius: '8px',
            padding: 4,
        },
    };

    const ref = useClickOutside(() => handleNodeKeyOnDropDown(item.address));

    if (type === 'pageTree') {
        return (
            <Dropdown
                trigger={['click']}
                menu={menuProps}
                data-testid="drawer-settings-option-btn"
                placement="rightTop"
            >
                <Button
                    {...rest}
                    ref={ref}
                    size="small"
                    style={{
                        width: 16,
                        height: 20,
                        border: 'none',
                    }}
                    icon={
                        <FontAwesomeIcon
                            icon={icon({
                                name: 'ellipsis-vertical',
                                style: 'solid',
                            })}
                        />
                    }
                    onClick={(event) => {
                        event.stopPropagation();
                        handleNodeKeyOnDropDown(item.address);
                    }}
                    {...rest}
                />
            </Dropdown>
        );
    }
    return (
        <Button
            {...rest}
            size="small"
            style={{
                width: 16,
                height: 20,
                border: 'none',
            }}
            icon={
                <FontAwesomeIcon
                    icon={icon({ name: 'ellipsis-vertical', style: 'solid' })}
                />
            }
            onClick={(event) => {
                event.stopPropagation();
                handleContextMenu({
                    event,
                    node: {
                        key: item.address,
                    },
                });
            }}
            {...rest}
        />
    );
};

TreeTitle.propTypes = {
    item: T.shape({
        title: T.oneOfType([T.string, T.object]),
        address: T.string.isRequired,
        isDropDownActive: T.bool,
    }),
    handleContextMenu: T.func.isRequired,
    handleNodeKeyOnDropDown: T.func,
    type: T.string,
};

export default TreeTitle;
