/*****************************************************
 * Packages
 ******************************************************/
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Tabs, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

/*****************************************************
 * Locals
 ******************************************************/
import { getType } from 'util/dndHelpers';
import { DND_TYPES } from '../../../../../constants';
import { getTabContentItems } from '../utils/modal';
import { Float } from './Float';
import { AddElementHeaderStc, AddElementStc } from './Modal.stc';
import { BuilderContext } from 'contexts/BuilderContext';
import { useContext } from 'react';

const { SECTION, ROW, COLUMN, CONTAINER, CONTAINERS, COMPONENT, CMS_ROW } =
    DND_TYPES;

/**
 * Creates and adds an element to a parent element.
 *
 * @param {object} options - The options for creating and adding an element.
 * @param {string} options.type - The type of the element to be added.
 * @param {string} [options.parentType=''] - The type of the parent element.
 * @param {Function} options.onClose - The callback function to be called when the element is closed.
 */
export const AddElement = ({ type, parentType = '', onClose, editAddress }) => {
    const { appName } = useContext(BuilderContext);
    const items = getTabContentItems({
        type,
        parentType,
        editAddress,
        appName,
    });

    return (
        <Float
            width={540}
            footer={false}
            title={
                <Header
                    onClose={onClose}
                    type={type}
                    parentType={parentType}
                    appName={appName}
                />
            }
        >
            <AddElementStc total={items.length}>
                <Tabs size="small" items={items} />
            </AddElementStc>
        </Float>
    );
};

/**
 * Renders the header for adding elements to a container.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.onClose - The function to call when user closes the modal.
 * @param {string} props.type - The type of element to add.
 * @param {string} props.parentType - The parent type of the element being added.
 *
 * @returns {JSX.Element} - The rendered header component.
 *
 * @example
 *
 * // Render a header for adding a column element to a row.
 * <Header onClose={handleClose} type="COLUMN" parentType="ROW" />
 */
const Header = ({ onClose, type, parentType, appName }) => {
    const { t } = useTranslation('builder');

    const title =
        {
            [SECTION]: t('Add Section'),
            [ROW]:
                parentType === COLUMN
                    ? t('Add Element Or Nested Columns')
                    : t('Add Columns'),
            [COLUMN]: t('Add Column'),
            [CONTAINER]:
                parentType !== SECTION
                    ? t('Add Container')
                    : t('Add Containers or Row with Columns'),
            [COMPONENT]:
                parentType === COLUMN
                    ? t('Add Element')
                    : t('Add Element Or Containers'),
            [CONTAINERS]: t('Add Containers or Row with Columns'),
            [CMS_ROW]: t('Add Containers or Row with Columns'),
        }[getType(type)] || t('Add Element');

    return (
        <AddElementHeaderStc>
            <Flex justify="space-between" align="center" className="handler">
                <Typography.Title level={5}>{title}</Typography.Title>
                <FontAwesomeIcon
                    onClick={onClose}
                    icon={icon({ name: 'times', style: 'regular' })}
                />
            </Flex>
        </AddElementHeaderStc>
    );
};
