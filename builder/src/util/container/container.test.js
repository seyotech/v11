import { containerBlocks } from 'modules/Element/data/elements';
import {
    CreateContainer,
    createContainers,
    createWithSection,
    generateContainers,
} from './container';

const sizes = [25, 50, 25];

describe('CreateContainer', () => {
    test('should create a container with default values', () => {
        const container = new CreateContainer({});
        expect(container.name).toBe('Container');
        expect(container.style).toEqual({
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: [
                ['top', '10px'],
                ['bottom', '10px'],
            ],
        });
        expect(container.holder).toBe('container');
    });

    test('should create a container with custom values', () => {
        const container = new CreateContainer({
            name: 'CustomContainer',
            style: {
                flexBasis: '50%',
            },
            holder: 'customHolder',
        });
        expect(container.name).toBe('CustomContainer');
        expect(container.style).toEqual({
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: [
                ['top', '10px'],
                ['bottom', '10px'],
            ],
            flexBasis: '50%',
        });
        expect(container.holder).toBe('customHolder');
    });

    test('should create a container with media style', () => {
        const container = new CreateContainer({
            style: {
                flexBasis: '50%',
            },
            media: {
                mobile: {
                    style: {
                        flexBasis: '100%',
                    },
                },
            },
        });

        expect(container.style).toMatchObject(
            expect.objectContaining({
                flexBasis: '50%',
            })
        );

        expect(container.media.mobile.style).toEqual({
            flexBasis: '100%',
        });
    });
});

describe('createContainers', () => {
    test.each(sizes)(
        'should create an array of containers with specified sizes',
        (size) => {
            const containers = createContainers({ sizes });
            expect(containers.content.length).toBe(3);
            const index = sizes.indexOf(size);
            expect(containers.content[index].style.flexBasis).toBe(`${size}%`);
        }
    );
});

describe('createWithSection', () => {
    test.each(sizes)(
        'should create a section with a root container and child containers of specified sizes',
        (size) => {
            const section = createWithSection({ sizes });
            expect(section.content.length).toBe(1);
            const rootContainer = section.content[0];
            expect(rootContainer.holder).toBe('root');
            expect(rootContainer.style.flexBasis).toBe('100%');
            expect(rootContainer.content.length).toBe(3);
            const index = sizes.indexOf(size);
            expect(rootContainer.content[index].style.flexBasis).toBe(
                `${size}%`
            );
        }
    );
});

describe('generateContainers', () => {
    test.each(sizes)(
        'should generate root container with specified sizes',
        (size) => {
            const rootContainer = generateContainers({
                cols: sizes.join('+'),
                addElType: 'CONTAINERS',
                editAddress: '0.-1',
            });
            expect(rootContainer.holder).toBe('root');
            expect(rootContainer.style.flexBasis).toBe('100%');
            expect(rootContainer.content.length).toBe(3);
            const index = sizes.indexOf(size);
            expect(rootContainer.content[index].style.flexBasis).toBe(
                `${size}%`
            );
        }
    );

    const cols = [33.33, 33.33, 33.33];
    test.each(cols)('should generate section with specified sizes', (size) => {
        const section = generateContainers({
            cols: cols.join('+'),
            addElType: 'SECTION',
            editAddress: '0',
        });
        expect(section.content.length).toBe(1);
        const rootContainer = section.content[0];
        expect(rootContainer.holder).toBe('root');
        expect(rootContainer.style.flexBasis).toBe('100%');
        expect(rootContainer.content.length).toBe(3);

        const index = cols.indexOf(size);
        expect(rootContainer.content[index].style.flexBasis).toBe(`${size}%`);
    });

    test.each(cols)(
        'should generate containers with root container',
        (size) => {
            const rootContainer = generateContainers({
                cols: cols.join('+'),
                // address length is 2
                editAddress: '0.1',
            });

            expect(rootContainer.holder).toBe('root');
            expect(rootContainer.style.flexBasis).toBe('100%');
            expect(rootContainer.content.length).toBe(3);
            const index = cols.indexOf(size);
            expect(rootContainer.content[index].style.flexBasis).toBe(
                `${size}%`
            );
        }
    );

    test.each([10, 20, 30, 40])(
        'should generate containers with specified sizes',
        (size) => {
            const cols = '10+20+30+40';
            const containers = generateContainers({
                cols,
                addElType: 'CONTAINERS',
                editAddress: '0.0.1',
            });
            expect(containers.content.length).toBe(4);
            expect(containers.holder).toBe('container');

            const index = cols.split('+').indexOf(`${size}`);
            expect(containers.content[index].style.flexBasis).toBe(`${size}%`);
        }
    );

    test('should generate containers with default sizes', () => {
        const containers = generateContainers({
            cols: '100',
            addElType: 'CONTAINERS',
            editAddress: '0.0.1',
        });
        expect(containers.content.length).toBe(1);
        expect(containers.style.flexBasis).toBe('100%');
    });

    test('should generate padding to all side  for root container', () => {
        const containers = generateContainers({
            cols: '100',
            addElType: 'CONTAINERS',
            editAddress: '0.0',
        });
        expect(containers.content.length).toBe(1);
        expect(containers.style).toStrictEqual(
            expect.objectContaining({
                padding: [
                    ['top', '10px'],
                    ['left', '10px'],
                    ['right', '10px'],
                    ['bottom', '10px'],
                ],
            })
        );
    });

    test('should generate padding only top and bottom side  for nested container', () => {
        const containers = generateContainers({
            cols: '100',
            addElType: 'CONTAINERS',
            editAddress: '0.0.1',
        });
        expect(containers.content.length).toBe(1);
        expect(containers.style).toStrictEqual(
            expect.objectContaining({
                padding: [
                    ['top', '10px'],
                    ['bottom', '10px'],
                ],
            })
        );
    });

    test.each(sizes)(
        'should container %# be responsive in mobile device ',
        (size) => {
            const { content: nestedContainers } = generateContainers({
                cols: sizes.join('+'),
                addElType: 'CONTAINERS',
                editAddress: '0.0.1',
            });

            const currentIndex = parseInt(
                expect.getState().currentTestName.match(/\d+/)
            );

            const nestedContainer = nestedContainers[currentIndex];

            // actual size in desktop
            expect(nestedContainer.style).toStrictEqual(
                expect.objectContaining({
                    flexBasis: `${size}%`,
                })
            );

            // media is undefined in tablet (fallback to desktop)
            expect(nestedContainer.media.tablet).toBeUndefined();

            // size is 100% in mobile
            expect(nestedContainer.media.mobile.style).toStrictEqual(
                expect.objectContaining({
                    flexBasis: `100%`,
                })
            );
        }
    );

    test.each(containerBlocks)(
        'should generate container with single column with block (%s)',
        (cols) => {
            const containers = generateContainers({
                cols,
                addElType: 'CONTAINERS',
                editAddress: '0.0.0',
            });
            expect(containers.content.length).toBe(cols.split('+').length);
            expect(containers.holder).toStrictEqual('container');
        }
    );
});
