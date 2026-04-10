// --------------- PACKAGES ---------------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useDrag } from 'react-dnd';

// --------------- LOCAL ---------------
import { getDnDConfig } from '@/util/dndHelpers';
import { Tag } from 'antd';
import { BuilderContext } from 'contexts/BuilderContext';
import { ElementContext } from 'contexts/ElementRenderContext';
import { useTranslation } from 'react-i18next';
import validateMembership from 'util/validateMembership';
import { antToken } from '../../../antd.theme';
import { CardStc, ParagraphStc } from './Element.stc';
import useFeatureFlag from 'hooks/useFeatureFlag';
import { featureFlagEnums } from 'constants/featureFlag';

const getElementInfo = ({ item = {} }) => {
    const { renderType, title, data, type } = item;

    const elType =
        renderType === 'SECTION' ? title.toUpperCase() : data?._elType;

    const dndConfig = getDnDConfig(data?.type || type);

    return {
        data,
        elType,
        addElType: elType,
        type: dndConfig.type,
    };
};

const Element = ({ item, canDrag = true }) => {
    const { excludePlans } = item;
    const info = getElementInfo({ item });
    const { editAddress, addElement } = useContext(ElementContext);
    const { user, usePlanKey, dorikAppURL } = useContext(BuilderContext);
    const { t } = useTranslation('builder');
    const { isFreeUser, planKey } = usePlanKey();
    const isGlobalSearchEnabled = useFeatureFlag(
        featureFlagEnums.GLOBAL_SEARCH
    );
    const enableBadge = excludePlans && isFreeUser;
    const isElementAccessible = validateMembership({
        excludePlans,
        user,
        planKey,
    });

    const [{ isDragging }, connectDragSource, connectDragPreview] = useDrag(
        {
            type: info.type,
            item: {
                info,
                address: '',
                parentType: '',
                type: info.type,
            },

            collect: (monitor) => {
                return {
                    isDragging: monitor.isDragging(),
                };
            },
        },
        [item?.data]
    );

    const handleElementClick = () => {
        if (!editAddress) return;

        const enablePlanRoute = [
            'super_user',
            'sys_admin',
            'sys_reviewer',
        ].includes(user.role);

        if (isElementAccessible) {
            addElement({ ...info, insertAddress: editAddress });
        } else {
            enablePlanRoute &&
                window.open(`${dorikAppURL}/dashboard/pricing/plans`, '_blank');
        }
    };

    if (item.data?.type === 'globalSearch' && !isGlobalSearchEnabled)
        return null;

    return (
        <CardStc
            key={item.title}
            canDrag={canDrag}
            isElementAccessible={isElementAccessible}
            role="draggable-element"
            onClick={handleElementClick}
            ref={(node) =>
                canDrag && isElementAccessible && connectDragSource(node)
            }
        >
            {enableBadge && (
                <Tag
                    title={t('Paid Element')}
                    className="pro-element"
                    color={antToken.colorPrimary}
                >
                    {t('Paid')}
                </Tag>
            )}
            <FontAwesomeIcon
                icon={item.icon}
                style={{ fontSize: '28px', color: '#747192' }}
                data-testid={`thin-${item.title}`}
            />
            <ParagraphStc ellipsis={true}>{t(item.title)}</ParagraphStc>
        </CardStc>
    );
};

Element.propTypes = {
    item: PropTypes.shape({
        icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
            .isRequired,
        title: PropTypes.string.isRequired,
        data: PropTypes.object,
        membership: PropTypes.array,
        badgeText: PropTypes.string,
    }).isRequired,
    canDrag: PropTypes.bool,
};

export default Element;
