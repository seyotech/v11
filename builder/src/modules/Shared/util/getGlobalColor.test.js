import { getGlobalColor } from './getGlobalColor';

it('should return the correct global color key value pair', () => {
    const result1 = getGlobalColor({
        currentColor: 'var(--color-1)',
        globalColors: [
            { key: '--color-1', value: 'red' },
            { key: '--color-11', value: 'blue' },
            { key: '--color-6', value: 'green' },
        ],
    });
    expect(result1).toStrictEqual({ key: '--color-1', value: 'red' });
    const result2 = getGlobalColor({
        currentColor: 'var(--color-11)',
        globalColors: [
            { key: '--color-1', value: 'red' },
            { key: '--color-11', value: 'blue' },
            { key: '--color-6', value: 'green' },
        ],
    });
    expect(result2).toStrictEqual({ key: '--color-11', value: 'blue' });
});

it('should return the plain color string if not color variable', () => {
    const result = getGlobalColor({
        currentColor: 'orange',
        globalColors: [
            { key: '--color-1', value: 'red' },
            { key: '--color-6', value: 'green' },
        ],
    });
    expect(result).toBe('orange');
});

it('should return undefined if the var color key does not match in the global colors', () => {
    const result = getGlobalColor({
        currentColor: 'var(--color-2)',
        globalColors: [
            { key: '--color-1', value: 'red' },
            { key: '--color-6', value: 'green' },
        ],
    });
    expect(result).toBe(undefined);
});
