import uniqId from './uniqId';

export default class CreateCMSColumn {
    constructor({ size, name = 'Column' }) {
        return {
            name,
            style: {},
            content: [],
            id: uniqId(),
            _elType: 'COLUMN',
            type: 'column',
            component_path: 'column',
            cms_column: true,
            attr: {
                __class__columnSize: size,
            },
        };
    }
}
