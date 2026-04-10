/*****************************************************
 * Packages
 ******************************************************/
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

/*****************************************************
 * Locals
 ******************************************************/
import Tooltip from 'components/Tooltip';

/**
 * Adds a container element to the interface.
 * Creates a button with a tooltip that triggers the `onContainerAdd` function when clicked.
 * The tooltip content and button label are determined by the `type` parameter.
 *
 * @param {Object} options - The options object.
 * @param {function} options.onContainerAdd - The function called when the button is clicked.
 * @param {string} options.type - The type of container element to add.
 * @returns {ReactElement} - The container add button element.
 */
export const AddContainerElement = ({ onContainerAdd, type }) => {
    const { t } = useTranslation('builder');
    const content =
        type === 'container'
            ? t('Add Element Or Container')
            : t('Add Containers');

    return (
        <Tooltip effect="hover" content={content} data-test="tooltip">
            <Button
                size="large"
                shape="circle"
                type="primary"
                onClick={(e) => onContainerAdd(e, type)}
                icon={<FontAwesomeIcon icon={['far', 'plus']} />}
            />
        </Tooltip>
    );
};
