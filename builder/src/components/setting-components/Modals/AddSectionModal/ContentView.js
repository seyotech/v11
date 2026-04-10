/*****************************************************
 * Packages
 ******************************************************/
import React, { useContext, useState } from 'react';
/*****************************************************
 * Locals
 ******************************************************/
import { Title, TitleWrap } from './AddSectionModal.stc';
import DefaultElement from './DefaultElement';
import EmptyRowCol from './EmptyRowCol';
import LibraryView from './LibraryView';
import Loading from './Loading';
/*****************************************************
 * Store
 ******************************************************/
import { Select } from 'antd';
import EmptyContainer from 'modules/Element/components/EmptyContainer';
import { BuilderContext } from '../../../../contexts/BuilderContext';
import { ElementContext } from '../../../../contexts/ElementRenderContext';

const allSections = {
    EmptyRowCol,
    LibraryView,
    EmptyContainer,
    DefaultElement,
};
const { useCallback, useEffect } = React;

const ContentView = ({
    type,
    page,
    data = {},
    searchVal,
    validateMembership,
}) => {
    const {
        appName,
        elementTypes,
        getElements,
        getSavedElements,
        isFetching,
        getVisibleElements,
        excludes = [],
    } = useContext(BuilderContext);

    const { addElement } = useContext(ElementContext);
    const [currentTag, setCurrentTag] = useState('');
    const Component = allSections[data.component];
    const isProvided = data.select ? data.select.includes('provided') : false;

    let elements = data.select
        ? getVisibleElements(data.select)
        : data.elements;


    useEffect(() => {
        const handler = isProvided
            ? getElements
            : (value) => {
                  return getSavedElements(value, data.select);
              };
        data.request && data.request(handler);
    }, [data]);

    const handleFilter = useCallback((value) => {
        setCurrentTag(value);
    }, []);

    if (data.type && !elementTypes.includes(data.type)) {
        return null;
    }

    if (excludes.includes(data.component)) return null;

    return (
        <>
            <TitleWrap>
                <Title>{data.title}</Title>
                {data.hasDropdown && (
                    <div>
                        <Filters
                            tag={currentTag}
                            elements={elements}
                            onFilter={handleFilter}
                        />
                    </div>
                )}
            </TitleWrap>
            {isFetching && !elements?.length && <Loading />}
            {Component ? (
                <Component
                    page={page}
                    type={type}
                    searchVal={searchVal}
                    appName={appName}
                    isCmsRow={!!cmsRow}
                    elementType={data.type}
                    data={filteredElements}
                    isProvided={isProvided}
                    addElement={addElement}
                    validateMembership={validateMembership}
                />
            ) : null}
        </>
    );
};

export default React.memo(ContentView);

function Filters({ elements = [], tag, onFilter }) {
    const filters = [...new Set(elements.flatMap((val) => val.tags))].map(
        (val) => ({ value: val, label: val })
    );

    return (
        <Select
            value={tag}
            defaultValue=""
            style={{ width: '100%' }}
            options={[{ value: '', label: 'All Blocks' }].concat(filters)}
            onChange={onFilter}
        />
    );
}
