/*****************************************************
 * Packages
 ******************************************************/
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/*****************************************************
 * Locals
 ******************************************************/
import { AntCollapse as Collapse } from './index.stc';

const AntCollapse = ({ defaultActiveKey, items, onChange = () => {} }) => {
    return (
        <Collapse
            size="small"
            defaultActiveKey={defaultActiveKey}
            expandIcon={({ isActive }) => (
                <FontAwesomeIcon
                    style={{ height: 14, width: 14 }}
                    icon={icon({ name: 'caret-right', style: 'solid' })}
                    {...(isActive && { rotation: 90 })}
                    data-testid="expand-icon"
                />
            )}
            items={items}
            onChange={(activekeys) => {
                onChange(activekeys);
            }}
        />
    );
};

export default AntCollapse;
