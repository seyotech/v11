import { getExpandedKeys } from './navigation';

describe('getExpandedKeys', () => {
    it('should return an empty array when treeData is empty', () => {
        const input = {
            treeData: [],
            searchTerm: 'search',
        };
        const output = [];
        expect(getExpandedKeys(input)).toEqual(output);
    });

    it('should return an empty array when searchTerm is empty', () => {
        const input = {
            treeData: [
                { key: '1', title: 'Node 1' },
                {
                    key: '2',
                    title: 'Node 2',
                    children: [{ key: '3', title: 'Node 3' }],
                },
            ],
            searchTerm: '',
        };
        const output = [];
        expect(getExpandedKeys(input)).toEqual(output);
    });

    it('should return an empty array when no node title matches the searchTerm', () => {
        const input = {
            treeData: [
                { key: '1', title: 'Node 1' },
                {
                    key: '2',
                    title: 'Node 2',
                    children: [{ key: '3', title: 'Node 3' }],
                },
            ],
            searchTerm: 'search',
        };
        const output = [];
        expect(getExpandedKeys(input)).toEqual(output);
    });

    it('should return an array with the parent keys when searchTerm matches a child node title', () => {
        const input = {
            treeData: [
                { key: '0-0', title: 'Node 1' },
                {
                    key: '0-0-0',
                    title: 'Node 2',
                    children: [{ key: '0-0-0-0', title: 'Node search' }],
                },
            ],
            searchTerm: 'search',
        };
        const output = ['0-0-0'];
        expect(getExpandedKeys(input)).toEqual(output);
    });

    it('should return an array with the top parent keys when searchTerm matches multiple child node titles', () => {
        const input = {
            treeData: [
                { key: '0-1', title: 'Node 1' },
                {
                    key: '0-1-0',
                    title: 'search Node',
                    children: [{ key: '0-1-0-0', title: 'Node search' }],
                },
            ],
            searchTerm: 'search',
        };
        const output = ['0-1'];
        expect(getExpandedKeys(input)).toEqual(output);
    });

    it('should return an array with the parent keys when searchTerm matches multiple child node titles across different levels', () => {
        const input = {
            treeData: [
                { key: '0-2', title: 'search Node' },
                {
                    key: '0-2-0',
                    title: 'Node 2',
                    children: [
                        { key: '0-2-0-0', title: 'Node search' },
                        {
                            key: '0-2-0-0-0',
                            title: 'Node 4',
                            children: [
                                { key: '0-2-0-0-0-0', title: 'Node search' },
                            ],
                        },
                    ],
                },
            ],
            searchTerm: 'search',
        };
        const output = ['0', '0-2-0', '0-2-0-0-0'];
        expect(getExpandedKeys(input)).toEqual(output);
    });
});
