import React from 'react';
import getPathValue from '../util/getPathValue';

function useCollectionFields({ address, data }) {
    const item = getPathValue(address, data);
    return item;
}

export default useCollectionFields;
