import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import elements from '../../../Element/data/elements';

const flatElements = elements.flatMap((item) => item.items);

const getElementIcon = ({ type }) => {
    const icon = flatElements.find(
        (el) => el?.type === type || el?.data?.type === type
    ).icon;

    return icon;
};

const Icon = ({ item }) => {
    if (!item) null;
    let elIcon = {
        SECTION: icon({ name: 'folder', style: 'light' }),
        ROW: icon({ name: 'grip-horizontal', style: 'light' }),
        CMSROW: icon({ name: 'grip-horizontal', style: 'light' }),
        COLUMN: icon({ name: 'columns', style: 'light' }),
        PAGE: icon({ name: 'file', style: 'light' }),
        HOME: icon({ name: 'home', style: 'light' }),
        ELEMENT: getElementIcon(item),
    }[item._elType];

    if (!elIcon) return null;

    return <FontAwesomeIcon icon={elIcon} data-testid={elIcon.iconName} />;
};

export default Icon;
