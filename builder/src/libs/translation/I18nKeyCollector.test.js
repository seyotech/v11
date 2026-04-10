const {
    REGEX_PATTERNS,
    I18nKeyCollector,
    ACCEPTABLE_LABELS,
    KEY_VALIDATION_STATUS,
} = require('./I18nKeyCollector');

const MockParser = {
    set: vi.fn(),
};

const mockValidData = [
    ['name', 'First character starts with capital letter or digit'],
    [
        'placeholder',
        'Start with capita later but can not include two adjacent x',
    ],
    ['info', 'Info can contain anything'],
    ['helpText', '<strong>Help text contain html tag too</strong>'],
    [
        'label',
        'First character starts with capital letter or digit or some special field are allowed',
    ],
    ['label', '- Select -'],
];

const mockInvalidData = [
    ['name', 'smaller-case-value'],
    ['placeholder', 'ex: 1234'],
    [
        'placeholder',
        'Start with capital letter but include adjacent x like 0-xx',
    ],
    ['label', 'camelCaseValue'],
    ['label', 'small-case-label'],
];

const i18nKeyCollector = new I18nKeyCollector(MockParser);

describe('I18nKeyCollector', () => {
    beforeEach(() => {
        MockParser.set.mockReset();
    });

    describe('getKeyMatcher', () => {
        it('should return TITLE regex pattern for path containing "modules/Element/data"', () => {
            const pathWithTitle = 'some/path/modules/Element/data/somefile.js';
            const matcher = i18nKeyCollector.getKeyMatcher(pathWithTitle);
            expect(matcher).toEqual(REGEX_PATTERNS.TITLE);
        });

        it('should return DEFAULT regex pattern for paths not containing "modules/Element/data"', () => {
            const pathWithoutTitle = 'some/other/path/somefile.js';
            const matcher = i18nKeyCollector.getKeyMatcher(pathWithoutTitle);
            expect(matcher).toEqual(REGEX_PATTERNS.DEFAULT);
        });
    });

    describe('validateExtractionKey', () => {
        it.each(mockValidData)(
            'should return true for a valid key-value pair',
            (key, value) => {
                const isValid = i18nKeyCollector.validateExtractionKey({
                    key,
                    value,
                });
                expect(isValid).toBe(true);
            }
        );

        it.each(['100%', '60k'])(
            'should return false for an excluded value based on the exclude pattern',
            (value) => {
                const isValid = i18nKeyCollector.validateExtractionKey({
                    key: 'info',
                    value,
                });
                expect(isValid).toBe(false);
            }
        );

        it.each(ACCEPTABLE_LABELS)(
            'should return true for the value listed in ACCEPTABLE_LABELS',
            (value) => {
                const isValid = i18nKeyCollector.validateExtractionKey({
                    key: 'info',
                    value,
                });
                expect(isValid).toBe(true);
            }
        );
    });

    describe('setKey', () => {
        beforeEach(() => {
            vi.spyOn(i18nKeyCollector, 'reportWithStatus');
            vi.spyOn(console, 'log');
        });

        it.each(mockValidData)(
            'should call parser.set with the valid value',
            (key, value) => {
                const matchedString = `${key}: "${value}"`;
                i18nKeyCollector.setKey(matchedString);
                expect(MockParser.set).toHaveBeenCalledWith(value);
            }
        );

        it.each(mockInvalidData)(
            'should not call parser.set with as values are invalid',
            (key, value) => {
                const matchedString = `${key}: "${value}"`;
                i18nKeyCollector.setKey(matchedString);
                expect(MockParser.set).not.toHaveBeenCalledWith(value);
            }
        );

        it.each(mockValidData)(
            'should call reportWithStatus with the correct parameters with "VALID" status',
            (key, value) => {
                const matchedString = `${key}: "${value}"`;
                i18nKeyCollector.setKey(matchedString);
                expect(i18nKeyCollector.reportWithStatus).toHaveBeenCalledWith(
                    true,
                    matchedString
                );
                expect(console.log).toHaveBeenCalledWith(
                    `\x1b[${KEY_VALIDATION_STATUS.VALID}m%s\x1b[0m`,
                    matchedString
                );
            }
        );

        it.each(mockInvalidData)(
            'should call reportWithStatus with the correct parameters with "INVALID" status',
            (key, value) => {
                const matchedString = `${key}: "${value}"`;
                i18nKeyCollector.setKey(matchedString);
                expect(i18nKeyCollector.reportWithStatus).toHaveBeenCalledWith(
                    false,
                    matchedString
                );
                expect(console.log).toHaveBeenCalledWith(
                    `\x1b[${KEY_VALIDATION_STATUS.INVALID}m%s\x1b[0m`,
                    matchedString
                );
            }
        );
    });
});
