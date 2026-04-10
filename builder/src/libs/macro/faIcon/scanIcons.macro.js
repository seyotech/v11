const { createMacro } = require('babel-plugin-macros');
const generateIconModule = require('./helpers');

module.exports = createMacro(scanIcons);

function scanIcons({ references, state, babel }) {
    references.default.forEach((referencePath) => {
        const fileOpts = state.file.opts;
        const [firstArgumentPath] = referencePath.parentPath.get('arguments');

        const options = firstArgumentPath.evaluate().value;

        const module = generateIconModule({ root: fileOpts.root, ...options });
        const scripts = babel.template(module, {
            preserveComments: true,
            placeholderPattern: false,
            ...fileOpts.parserOpts,
            sourceType: 'module',
        })();
        const scanIconsCallPath = firstArgumentPath.parentPath;
        scanIconsCallPath.replaceWithMultiple(scripts);
    });
}
