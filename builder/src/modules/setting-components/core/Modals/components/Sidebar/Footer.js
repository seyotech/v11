/*****************************************************
 * Packages
 ******************************************************/
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from 'antd';
import T from 'prop-types';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from 'contexts/BuilderContext';
import { SIDEBAR_DIRECTION } from '../../constants';
import { FooterStc } from '../Modal.stc';

function Footer({ sidebarPosition, handleSidebarPosition }) {
    const { isWhiteLabelEnabled } = useContext(BuilderContext);
    const { t } = useTranslation('builder');

    return (
        <FooterStc>
            <SideToggle
                disabled={sidebarPosition === 'left'}
                handlePosition={() =>
                    handleSidebarPosition(SIDEBAR_DIRECTION.LEFT)
                }
                tooltipInfo={{
                    title: t('Move to the Left'),
                    placement: 'topRight',
                }}
            >
                <FontAwesomeIcon
                    icon={icon({
                        type: 'regular',
                        name: 'chevron-left',
                    })}
                />
            </SideToggle>
            {!isWhiteLabelEnabled && (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://help.dorik.io"
                >
                    {t('Read Documentation')}
                </a>
            )}
            <SideToggle
                disabled={sidebarPosition === 'right'}
                handlePosition={() =>
                    handleSidebarPosition(SIDEBAR_DIRECTION.RIGHT)
                }
                tooltipInfo={{
                    title: t('Move to the Right'),
                    placement: 'topLeft',
                }}
            >
                <FontAwesomeIcon
                    icon={icon({
                        type: 'regular',
                        name: 'chevron-right',
                    })}
                />
            </SideToggle>
        </FooterStc>
    );
}

Footer.propTypes = {
    sidebarPosition: T.string.isRequired,
    handleSidebarPosition: T.func.isRequired,
};

function SideToggle({ handlePosition, disabled, tooltipInfo, children }) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        handlePosition();
        setOpen(false);
    };

    return (
        <Tooltip open={open} {...tooltipInfo}>
            <Button
                type="text"
                icon={children}
                disabled={disabled}
                onClick={handleClick}
                data-testid="side-toggler"
                onMouseOver={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                style={{ borderColor: 'transparent' }}
            ></Button>
        </Tooltip>
    );
}

SideToggle.propTypes = {
    disabled: T.bool.isRequired,
    children: T.element.isRequired,
    tooltipInfo: T.object.isRequired,
    handlePosition: T.func.isRequired,
};

export default Footer;
