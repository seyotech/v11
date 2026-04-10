import { mockLibData } from '../__mocks__/mockLibrary';
import { getFormattedLibraryData } from './index';

describe('getFormattedLibraryData', () => {
    it('should return all the provided components into tag based panel correctly', () => {
        const expectedValue = getFormattedLibraryData(mockLibData);
        const tagsWithDuplicates = mockLibData.reduce((acc, { tags }) => {
            return [...acc, ...tags];
        }, []);

        const uniqueTags = Array.from(new Set(tagsWithDuplicates));
        expect(expectedValue.length).toBe(uniqueTags.length);
        uniqueTags.forEach((tag) => {
            const tagSpecificComponents = mockLibData.filter((lib) =>
                lib.tags.includes(tag)
            );
            const expectedTagSpecificComponents = expectedValue.find(
                (panel) => panel.title === tag
            ).components;
            //test if the components inside each tag specif panel are same as the incoming tag specific components
            expect(expectedTagSpecificComponents).toStrictEqual(
                tagSpecificComponents
            );
        });
    });
});
