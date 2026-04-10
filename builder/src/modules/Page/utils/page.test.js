import { getPageDropInfo } from './page';

describe('getPageDropInfo', () => {
    it.each(['/', 'index'])(
        'should return a warning if the dropSlug is a home page',
        (slug) => {
            const dropToGap = false;
            const dropPosition = 0;
            const dragNode = { slug: 'about', id: '45345464' };
            const node = { slug, id: '67576576576' };
            const result = getPageDropInfo({
                dropToGap,
                dropPosition,
                dragNode,
                node,
            });
            expect(result).toEqual({
                warning: 'You cannot insert a page into a home page',
            });
        }
    );

    it.each(['', undefined, false, null])(
        'should return a warning if droppedId is falsy',
        (id) => {
            const dropToGap = false;
            const dropPosition = 0;
            const dragNode = { slug: 'about' };
            const node = { slug: 'unknown', id };
            const result = getPageDropInfo({
                dropToGap,
                dropPosition,
                dragNode,
                node,
            });
            expect(result).toEqual({
                warning: 'You cannot insert a page into an unknown page',
            });
        }
    );

    it('should return a warning if the drag node is being moved within the same layer as the drop node', () => {
        const dropToGap = false;
        const dropPosition = 0;
        const dragNode = { slug: 'en/about' };
        const node = { slug: 'en', id: 123 };
        const result = getPageDropInfo({
            dropToGap,
            dropPosition,
            dragNode,
            node,
        });
        expect(result).toEqual({
            warning: 'You cannot move a page within the same layer',
        });
    });

    it('should return the parentSlug if there are no warnings', () => {
        const dropToGap = false;
        const dropPosition = 0;
        const dragNode = { slug: 'en/about' };
        const node = { slug: 'services', id: 456 };
        const result = getPageDropInfo({
            dropToGap,
            dropPosition,
            dragNode,
            node,
        });
        expect(result).toEqual({ parentSlug: 'services/about' });
    });

    it('should return the parentSlug with the lastPartOfDragNode if dropToGap is true and dropPosition > 0', () => {
        const dropToGap = true;
        const dropPosition = 2;
        const dragNode = { slug: 'about/me' };
        const node = { slug: 'services', id: 456 };
        const result = getPageDropInfo({
            dropToGap,
            dropPosition,
            dragNode,
            node,
        });
        expect(result).toEqual({ parentSlug: 'me' });
    });
});
