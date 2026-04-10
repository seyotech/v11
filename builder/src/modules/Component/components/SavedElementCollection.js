/*****************************************************
 * Packages
 ******************************************************/
import { useContext, useEffect, useMemo, useState } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from 'contexts/BuilderContext';
import ucFirst from 'util/ucFirst';
import { ElementContext } from 'contexts/ElementRenderContext';
import { PreservedElementCollections } from './PreservedElementCollections';
import { withSearchFilterWrap } from 'modules/Element/hoc';
import { hasContainerSymbolInLayer } from 'util/dndHelpers';

/**
 * Represents a collection of saved elements.
 * This component fetches and combines saved elements from multiple keys
 * and renders them using the `PreservedElementCollections` component.
 *
 * @param {Object} props - The props for the `SavedElementCollection` component.
 * @param {Array} props.keys - The keys for fetching saved elements.
 * @param {string} props.searchVal - value of search input
 * @param {Function} props.searchFilter -to client side filter the saved elements based on the search value
 * @param {Function} props.sorter -to sort the saved elements in alphabetical order
 *
 * @returns {ReactElement} The rendered `PreservedElementCollections` component.
 *
 * @example
 * const keys = ['exampleKey1', 'exampleKey2'];
 * const searchVal='button'
 * const searchFilter = ({ item, type: 'title', searchVal })=>{};
 * const sorter = ({ currentItem, type: 'title', nextItem })=>{};
 * <SavedElementCollection keys={keys} searchVal={searchVal} searchFilter={searchFilter} sorter={sorter}/>
 */
const SavedElementCollection = ({
    keys = [],
    searchVal,
    searchFilter,
    sorter,
}) => {
    const { getDataByAddress, editAddress } = useContext(ElementContext);
    const { getSavedElements, getVisibleElements, isFetching, removeElement } =
        useContext(BuilderContext);
    const [keyIndex, setKeyIndex] = useState(0);
    const [elements, setElements] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const currentEditItem = getDataByAddress(editAddress);

    const fetchSavedElements = async (keyIndex) => {
        const key = keys[keyIndex];
        const listKey = `saved${ucFirst(key)}s`;

        getSavedElements(key, listKey);
    };

    const combinedSavedElements = (keyIndex) => {
        const key = keys[keyIndex];
        const listKey = `saved${ucFirst(key)}s`;

        const elements = getVisibleElements(listKey);
        setElements((prevElements = []) => {
            return [...prevElements, ...elements].filter(
                (obj, index, self) =>
                    index === self.findIndex((t) => t.id === obj.id)
            );
        });
    };

    let savedElements = elements;
    if (keys[keyIndex] === 'CONTAINER') {
        savedElements = savedElements.filter(
            (element) =>
                !hasContainerSymbolInLayer({
                    getDataByAddress,
                    targetItem: {
                        address: editAddress,
                        ...(currentEditItem.type === 'container' && {
                            symbolId: currentEditItem.symbolId,
                        }),
                    },
                    sourceItem: {
                        info: { data: JSON.parse(element.data || '{}') },
                    },
                })
        );
    }

    const filteredElements = savedElements
        .filter((item) => searchFilter({ item, type: 'title', searchVal }))
        .sort((currentItem, nextItem) =>
            sorter({ currentItem, type: 'title', nextItem })
        );

    const handleDeleteElement = async (id, type) => {
        const deleted = await removeElement(id, type);
        if (deleted) {
            setElements((prev = []) => {
                return prev.filter((element) => element.id !== id);
            });
        }
    };

    useEffect(() => {
        if (!isInitialized) {
            fetchSavedElements(keyIndex);
            setIsInitialized(true);
        } else if (false === isFetching) {
            combinedSavedElements(keyIndex);

            const nextKyeIndex = keyIndex + 1;
            if (nextKyeIndex < keys.length) {
                setKeyIndex(nextKyeIndex);
                fetchSavedElements(nextKyeIndex);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching, isInitialized, keyIndex]);

    const isLoading =
        !isInitialized || isFetching || keyIndex < keys.length - 1;

    return (
        <PreservedElementCollections
            elements={filteredElements}
            isFetching={isLoading}
            handleDeleteElement={handleDeleteElement}
        />
    );
};

export const SavedElementCollectionWithSearchFilter = withSearchFilterWrap(
    SavedElementCollection
);
