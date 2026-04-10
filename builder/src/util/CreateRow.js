import uniqId from './uniqId';

export default class CreateRow {
    constructor({ name = 'Row', nestedEl }) {
        return {
            name,
            type: 'row',
            content: [],
            id: uniqId(),
            _elType: 'ROW', // been used white saving element
            component_path: 'row',
            ...(nestedEl && { component_label: 'nestedRow' }),
            style: {},
        };
    }
}
