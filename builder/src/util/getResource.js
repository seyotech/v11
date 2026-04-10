import editorResources from '../../src/components/editor-resources';

/**
 * @param {String|Array} prop
 * @param {Object} [obj]
 */
export default function getResource(prop, obj = editorResources) {
    if (Array.isArray(prop)) {
        return prop[1];
    }
    return prop
        .split('/')
        .reduce(
            (acc, next) => (typeof acc !== 'object' ? undefined : acc[next]),
            obj
        );
}
