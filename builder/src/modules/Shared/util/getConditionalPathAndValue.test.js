import { getActiveStateData } from './getConditionalPathAndValue';

const generatePayload = ({
    cssProperty,
    hoverStateValue,
    normalStateValue,
}) => {
    return {
        activeState: 'pseudoClass/hover',
        path: `style/${cssProperty}`,
        data: {
            style: {
                [cssProperty]: normalStateValue,
            },
            pseudoClass: {
                hover: {
                    style: {
                        [cssProperty]: hoverStateValue,
                    },
                },
            },
        },
        value: normalStateValue,
    };
};

const mockColumnPayload = {
    path: 'attr/__class__columnSize',
    data: {
        attr: {
            __class__columnSize: '5/8',
        },
        media: {
            mobile: {
                attr: {
                    __class__columnSize: '1/2',
                },
            },
            tablet: {
                attr: {
                    __class__columnSize: '2/7',
                },
            },
        },
    },
    value: '5/8',
};

describe('getActiveStateData', () => {
    const testCases = ['blue', '', 'green', 'rgba(255,255,255,0.6)'];

    test.each(testCases)(
        'should return hover state value when hoverStateValue is %s',
        (hoverStateValue) => {
            const input = {
                hoverStateValue,
                normalStateValue: 'red',
                cssProperty: 'backgroundColor',
            };
            const result = getActiveStateData(generatePayload(input));
            expect(result).toStrictEqual(
                expect.arrayContaining([
                    `pseudoClass/hover/style/${input.cssProperty}`,
                    input.hoverStateValue,
                ])
            );
        }
    );

    test.each([null, undefined])(
        'should return normal state value when hoverStateValue is %s',
        (hoverStateValue) => {
            const input = {
                hoverStateValue,
                normalStateValue: 'red',
                cssProperty: 'backgroundColor',
            };
            const result = getActiveStateData(generatePayload(input));
            expect(result).toStrictEqual(
                expect.arrayContaining([
                    `pseudoClass/hover/style/${input.cssProperty}`,
                    input.normalStateValue,
                ])
            );
        }
    );

    describe('when pseudoClass is null', () => {
        test.each(testCases)(
            'should return normal state value when hoverStateValue is %s',
            (hoverStateValue) => {
                const input = {
                    hoverStateValue,
                    normalStateValue: 'red',
                    cssProperty: 'backgroundColor',
                };
                const payload = generatePayload(input);
                payload.data.pseudoClass = null;
                const result = getActiveStateData(payload);
                expect(result).toStrictEqual(
                    expect.arrayContaining([
                        `pseudoClass/hover/style/${input.cssProperty}`,
                        input.normalStateValue,
                    ])
                );
            }
        );
    });

    describe('when hover is null', () => {
        test.each(testCases)(
            'should return normal state value when hoverStateValue is %s',
            (hoverStateValue) => {
                const input = {
                    hoverStateValue,
                    normalStateValue: 'red',
                    cssProperty: 'backgroundColor',
                };
                const payload = generatePayload(input);
                payload.data.pseudoClass.hover = null;
                const result = getActiveStateData(payload);
                expect(result).toStrictEqual(
                    expect.arrayContaining([
                        `pseudoClass/hover/style/${input.cssProperty}`,
                        input.normalStateValue,
                    ])
                );
            }
        );
    });

    test.each(['mobile', 'desktop', 'tablet'])(
        'should return correct newValue for attr/__class__columnSize path for %s',
        (device) => {
            const payload = {
                ...mockColumnPayload,
                activeState: `media/${device}`,
            };
            const size =
                device === 'desktop'
                    ? payload.data.attr.__class__columnSize
                    : payload.data.media[device].attr.__class__columnSize;
            expect(getActiveStateData(payload)).toStrictEqual(
                expect.arrayContaining([
                    `media/${device}/${mockColumnPayload.path}`,
                    size,
                ])
            );
        }
    );
});
