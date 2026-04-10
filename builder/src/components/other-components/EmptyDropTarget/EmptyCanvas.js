/*****************************************************
 * Packages
 ******************************************************/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { Trans, useTranslation } from 'react-i18next';
import { combineFields } from 'util/getCombinedFields';
import { prefix_bcs } from '../../../config';
import { BuilderContext } from '../../../contexts/BuilderContext';

const controlIcons = [
    {
        icon: ['far', 'arrows-alt'],
    },
    {
        icon: ['far', 'edit'],
    },
    {
        icon: ['far', 'clone'],
    },
    {
        icon: ['far', 'save'],
    },
    {
        icon: ['far', 'trash-alt'],
    },
    {
        icon: ['far', 'layer-plus'],
    },
];

const quickStartGuide = [
    {
        key: 'basicBuilder',
    },
    {
        key: 'globalStyles',
    },
    {
        key: 'newRowsColumns',
    },
    {
        key: 'newElement',
    },
    {
        key: 'commonStyles',
    },
    {
        key: 'elementsGuide',
    },
    {
        key: 'responsiveDesign',
    },
];

function EmptySection({ children, isActive, connectDropTarget }) {
    const { isWhiteLabelEnabled } = useContext(BuilderContext);
    const { t } = useTranslation('builder');
    const builderSrt = getHelpLink({
        isWhiteLabelEnabled,
        content: 'basicBuilder',
    });
    const quickStartGuideTrans = t('quickStartGuide', { returnObjects: true });
    const controlIconsTrans = t('controlIcons', { returnObjects: true });
    const _quickStartGuide = combineFields({
        originalFields: quickStartGuide,
        transFields: quickStartGuideTrans,
    });
    const _controlIcons = combineFields({
        originalFields: controlIcons,
        transFields: controlIconsTrans,
    });

    const docLink = getHelpLink({ isWhiteLabelEnabled, content: 'root' });
    return (
        <div
            className={`${prefix_bcs} ${prefix_bcs}__empty-section`}
            ref={connectDropTarget}
            style={{ background: isActive ? '#3a30b333' : null }}
            data-testid="empty-page"
        >
            <h2 className={`${prefix_bcs}__empty-section-title-text`}>
                {t('Get Started by Adding New Sections')}
            </h2>
            <Trans>{t('empty-canvas-heading')}</Trans>
            {children}

            <hr className={`${prefix_bcs}__empty-section-line`} />
            <div className={`${prefix_bcs}__empty-section-guide`}>
                <div>
                    <h4>{t('Control Icons')}</h4>
                    <ul
                        className={`${prefix_bcs}__ul-normalize ${prefix_bcs}__ul-list`}
                    >
                        {_controlIcons.map((ctrl, idx) => (
                            <li key={idx}>
                                <FontAwesomeIcon
                                    fixedWidth
                                    icon={ctrl.icon}
                                    className="icon"
                                />{' '}
                                {ctrl.title}
                            </li>
                        ))}
                    </ul>
                </div>
                <>
                    <div>
                        <h4>{t('Quick Start Guide')}</h4>
                        <ul
                            className={`${prefix_bcs}__ul-normalize ${prefix_bcs}__ul-list`}
                        >
                            {_quickStartGuide.map((guide, idx) => {
                                const link = getHelpLink({
                                    isWhiteLabelEnabled,
                                    content: guide.key,
                                });
                                return (
                                    <li key={idx}>
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FontAwesomeIcon
                                                fixedWidth
                                                className="icon"
                                                icon={['far', 'chevron-right']}
                                            />{' '}
                                            {guide.title}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div>
                        <h4>{t('Builder Structure')}</h4>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={builderSrt}
                        >
                            <img
                                src="/assets/images/builder-component-help.png"
                                alt="Dorik Builder Controls"
                            />
                        </a>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                textDecoration: 'none',
                            }}
                            href={docLink}
                        >
                            {t('View in Documentation')}
                        </a>
                    </div>
                </>
            </div>
        </div>
    );
}

export default EmptySection;
