import uniqId from './uniqId';

export default class CreateColumn {
    constructor({ size, cmsRow, name = 'Column', nestedEl }) {
        return {
            name,
            style: {
                padding: nestedEl
                    ? []
                    : [
                          ['top', '15px'],
                          ['bottom', '15px'],
                      ],
            },
            content: [],
            id: uniqId(),
            _elType: 'COLUMN',
            type: 'column',
            component_path: 'column',
            ...(cmsRow && { cms_column: true }),
            ...(nestedEl && { component_label: 'nestedCol' }),
            attr: {
                __class__columnSize: size,
            },
        };
    }
}
