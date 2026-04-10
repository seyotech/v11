import { toolbarEnum } from '../../../toolbarEnum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createInlineStyleButton } from '@draft-js-plugins/buttons';

export const StrikeThrough = createInlineStyleButton({
    style: toolbarEnum.STRIKETHROUGH,
    children: (
        <FontAwesomeIcon
            style={{ height: 13, width: 13 }}
            icon={['far', toolbarEnum.STRIKETHROUGH.toLowerCase()]}
        />
    ),
});
