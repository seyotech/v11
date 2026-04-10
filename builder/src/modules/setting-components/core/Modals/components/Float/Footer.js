/*****************************************************
 * Packages
 ******************************************************/
import { Button } from 'antd';
import T from 'prop-types';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from 'contexts/BuilderContext';
import { FooterStc } from '../Modal.stc';

function Footer({ scale, setScale }) {
    const { isWhiteLabelEnabled } = useContext(BuilderContext);
    const { t } = useTranslation('builder');

    const resizeModal = (inc) => {
        const nextScale = Number(Number(scale).toFixed(2)) + inc;
        if (nextScale < 1 && nextScale > 1.25) return;
        setScale(nextScale);
        localStorage.setItem('__dorik_editor_modal_scale', nextScale);
    };

    return (
        <FooterStc style={{ padding: 8 }}>
            {isWhiteLabelEnabled ? (
                <div />
            ) : (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://help.dorik.io"
                >
                    {t('Read Documentation')}
                </a>
            )}
            <div>
                <Button
                    type="link"
                    size="small"
                    disabled={scale <= 1}
                    style={{ fontSize: '16px' }}
                    onClick={() => resizeModal(-0.05)}
                >
                    -
                </Button>
                {t('Resize')}
                <Button
                    type="link"
                    size="small"
                    disabled={scale >= 1.25}
                    style={{ fontSize: '16px' }}
                    onClick={() => resizeModal(0.05)}
                >
                    +
                </Button>
            </div>
        </FooterStc>
    );
}

Footer.propTypes = {
    scale: T.number.isRequired,
    setScale: T.func.isRequired,
};

export default Footer;
