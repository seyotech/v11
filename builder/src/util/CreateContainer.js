import uniqId from './uniqId';

const defaultStyles = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '0px',
};
export default class CreateContainer {
    constructor({ name = 'Container', style, holder = 'container' }) {
        return {
            name,
            holder,
            type: 'container',
            content: [],
            id: uniqId(),
            _elType: 'CONTAINER', // been used white saving element
            component_path: 'container',
            style: {
                ...defaultStyles,
                ...style,
            },
        };
    }
}
