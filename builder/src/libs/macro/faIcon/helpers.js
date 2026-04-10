const fs = require('fs');
const path = require('path');

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function camelCase(str) {
    return str
        .split('-')
        .map((s, index) => {
            return (
                (index === 0 ? s[0].toLowerCase() : s[0].toUpperCase()) +
                s.slice(1).toLowerCase()
            );
        })
        .join('');
}

const checkValidEntry = ({ include, exclude, entry }) => {
    const shouldInclude = !include || include.test(entry);
    const shouldExclude = exclude && exclude.test(entry);
    return shouldInclude && !shouldExclude;
};

const scanIcons = (dir, options) => {
    const { include, exclude, match } = options;

    function readFilesRecursively(dir) {
        try {
            const files = [];
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            entries.forEach((entry) => {
                const entryPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    files.push(...readFilesRecursively(entryPath));
                } else {
                    const isValidEntry = checkValidEntry({
                        include,
                        exclude,
                        entry: entryPath,
                    });

                    if (isValidEntry && match) {
                        const code = fs.readFileSync(entryPath, {
                            encoding: 'utf-8',
                        });
                        const matches = code.match(match) || [];
                        files.push(...matches);
                    }
                }
            });
            return files;
        } catch (error) {
            console.error(`Dynamically icon loading error: ${error}`);
            return [];
        }
    }
    return [...new Set(readFilesRecursively(dir))];
};

const styles = {
    fas: 'solid',
    fat: 'thin',
    fal: 'light',
    fad: 'duotone',
    far: 'regular',
};

const generateIconModule = ({ root, path: relativePath, pattern }) => {
    const iconRegexPattern = pattern || /(?<=')fa(?:r|s|l|d) .*(?=')/gi;
    const directoryPath = path.join(root, relativePath);
    const iconList = scanIcons(directoryPath, { match: iconRegexPattern });

    let iconImportExpression = '';
    const dynamicIconList = [];

    iconList.forEach((icon) => {
        const [prefix, iconName] = icon.split(' ');
        const style = styles[prefix];
        const name = `fa${capitalize(camelCase(iconName))}`;
        const dynamicIconName = `dynamic${name}${capitalize(style)}`;

        iconImportExpression += `import { ${name} as ${dynamicIconName} } from '@fortawesome/pro-${style}-svg-icons/${name}';`;

        dynamicIconList.push(dynamicIconName);
        console.log('\x1b[36m%s\x1b[0m', `Added ${name}`);
    });

    const scripts = `
        import { library as iconLibrary } from '@fortawesome/fontawesome-svg-core';
        ${iconImportExpression}
        iconLibrary.add(${dynamicIconList.join(', ')});
        `;

    return scripts;
};

module.exports = generateIconModule;
