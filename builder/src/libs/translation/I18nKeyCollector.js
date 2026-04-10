const KEY_VALIDATION_STATUS = {
    VALID: 32, // Green
    INVALID: 31, // Red
    WARN: 33, // Yellow
};
const ACCEPTABLE_LABELS = ['`After` CSS', '`Before` CSS', 'aa', '- Select -'];
const DEFAULT_KEYS = [
    'title',
    'name',
    'info',
    'label',
    '"family"',
    'helpText',
    'onLabel',
    'offLabel',
    'message',
    'placeholder',
    'borderLabel',
    'addButtonText',
];
const DEFAULT_KEYS_PATTERN = DEFAULT_KEYS.join('|');
const REGEX_PATTERNS = {
    KEY: /^[A-Z\d]/, // Match keys starting with a capital letter or digit
    EXCLUDE: /^\d+[%k]$/, // Match exclusion pattern (example pattern: 30k, 100%)
    PLACEHOLDER: /^[A-Z](?!.*-[xX]{2,}).*$/, // Match placeholder pattern with the exclusion of adjacent 'x' characters
    TITLE: /^(?:(?!\/\*\*).)*(?<key>title):\s*?('|")(?<value>.*?[^\\])\2/gm, // Match title field from the data directory
    LABEL: /^(?:(?!\/\*\*).)*(?<key>label):\s*?('|")(?<value>.*?[^\\])\2/gm, // Match label fields only
    DEFAULT: new RegExp(
        `^(?:(?!\\/\\*\\*).)*(?<key>${DEFAULT_KEYS_PATTERN}):\\s*?('|")(?<value>.*?[^\\\\])\\2`,
        'gm'
    ), // Match key-value pairs
};

const resourcesRestrictedByLabel = [
    'src/components/editor-resources/anim-edit-resources.js',
    'src/components/editor-resources/general-settings-elements/airtable.js',
];

class I18nKeyCollector {
    constructor(parser) {
        this.parser = parser;
    }

    getKeyMatcher = (path = '') => {
        if (/modules\/Element\/data/.test(path)) {
            return REGEX_PATTERNS.TITLE;
        }
        if (resourcesRestrictedByLabel.includes(path)) {
            return REGEX_PATTERNS.LABEL;
        }

        return REGEX_PATTERNS.DEFAULT;
    };

    validateExtractionKey({ key, value }) {
        if (REGEX_PATTERNS.EXCLUDE.test(value)) {
            return false;
        }

        switch (key) {
            case 'name':
                return REGEX_PATTERNS.KEY.test(value);
            case 'placeholder':
                return REGEX_PATTERNS.PLACEHOLDER.test(value);
            case 'label':
                return (
                    REGEX_PATTERNS.KEY.test(value) ||
                    ACCEPTABLE_LABELS.includes(value)
                );

            default:
                return true;
        }
    }

    setKey = (matched, index) => {
        const { key, value } = new RegExp(REGEX_PATTERNS.DEFAULT).exec(
            matched
        ).groups;

        const isValidKey = this.validateExtractionKey({
            key,
            value,
        });

        // Display key-value pairs with color coding to indicate their status: invalid, valid, and warning.
        this.reportWithStatus(isValidKey, `${key}: "${value}"`);

        isValidKey && this.parser.set(value);
    };

    reportWithStatus(validationFlag, report) {
        const statusCode = validationFlag
            ? KEY_VALIDATION_STATUS.VALID
            : false === validationFlag
            ? KEY_VALIDATION_STATUS.INVALID
            : KEY_VALIDATION_STATUS.WARN;

        console.log(`\x1b[${statusCode}m%s\x1b[0m`, report);
    }
}

module.exports = {
    REGEX_PATTERNS,
    I18nKeyCollector,
    ACCEPTABLE_LABELS,
    KEY_VALIDATION_STATUS,
};
