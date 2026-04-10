import { DND_TYPES } from '../../../constants';
import CreateRow from 'util/CreateRow';
import CreateSection from 'util/CreateSection';
import { createWithSection } from 'util/container/container';
import { getDnDConfig } from 'util/dndHelpers';

export const generateDataWithParentElements = ({ dragData, dragType }) => {
    const dndConfig = getDnDConfig(dragType);

    switch (dndConfig.type) {
        case DND_TYPES.COMPONENT:
        case DND_TYPES.CONTAINER: {
            const section = createWithSection({ sizes: [100] });
            const rootContainer = section.content[0];
            const nestedContainer = rootContainer.content[0];
            dragData && nestedContainer.content.push(dragData);

            return section;
        }

        case DND_TYPES.ROW:
        case DND_TYPES.CMS_ROW: {
            const section = new CreateSection();
            dragData && section.content.push(dragData);

            return section;
        }
        case DND_TYPES.COLUMN: {
            const section = new CreateSection();
            const row = new CreateRow({});
            dragData && row.content.push(dragData);
            section.content.push(row);

            return section;
        }

        default:
            break;
    }
};
