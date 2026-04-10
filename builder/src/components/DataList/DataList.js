import React from 'react';
import T from 'prop-types';

import { Input, Wrap } from './DataList.stc';

function DataList(props) {
    const { children, placeholder, listId, onSelect, value } = props;
    const handleChange = (e) => {
        const { value } = e.target;
        onSelect({ value });
    };

    return (
        <Wrap>
            <Input
                list={listId}
                type="search"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
            />
            <datalist id={listId}>{children}</datalist>
        </Wrap>
    );
}

DataList.propTypes = {
    placeholder: T.string,
    listId: T.string.isRequired,
    onSelect: T.func.isRequired,
};

export default DataList;
