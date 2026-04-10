import { FontAwesomeIcon } from '@/util/faHelpers';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

const SwitcherIcon = ({ expanded }) => {
    return (
        <FontAwesomeIcon
            style={{
                fontSize: 14,
                marginBottom: -2,
                color: 'rgba(0, 0, 0, 0.25)',
            }}
            icon={solid('caret-right')}
            data-testid="switcher-icon"
            className={expanded ? 'fa-rotate-90' : ''}
        />
    );
};

export default SwitcherIcon;
