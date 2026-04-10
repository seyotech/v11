import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import { Control } from '../Control';
import { LinkContent } from './LinkContent';
import { createPlugin } from '../../helpers';

const Link = (props) => {
    const { theme, onOverrideContent } = props;
    const onAddLinkClick = () => {
        onOverrideContent(LinkContent);
    };

    return (
        <Control
            theme={theme}
            onClick={onAddLinkClick}
            icon={icon({ style: 'regular', name: 'link' })}
        />
    );
};

export const linkPlugin = createPlugin({ Component: LinkContent });
