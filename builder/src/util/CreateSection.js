import uniqId from './uniqId';

export default class CreateSection {
    constructor(name = 'Section') {
        return {
            name,
            content: [],
            id: uniqId(),
            type: 'section',
            _elType: 'SECTION',
            component_path: 'section',
            pseudoClass: {
                before: {
                    style: { __gradientType: 'simple' },
                },
            },
        };
    }
}
