/*****************************************************
 * Packages
 ******************************************************/
import React, { createContext, forwardRef, useContext, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import styled from 'styled-components';
import isEqual from 'lodash.isequal';

/*****************************************************
 * Locals
 ******************************************************/
import { inputField } from '../reusable/shared-styles';
import useSimpleIconSearch from '../reusable/useSimpleIconSearch';

const NUM_COLUMNS = 8;
const PADDING_SIZE = 5;
const Input = styled.input`
    ${inputField}
    width: 100%;
`;

const LI = styled.div`
    display: flex;
    cursor: pointer;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    color: ${({ isSelected, theme }) => isSelected && theme.primary.bg};
    background: ${({ theme, isSelected }) => isSelected && theme.primary.fg};
`;

const OptionsContext = createContext({});

const OptionsProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredIcons = useSimpleIconSearch(searchTerm ?? '');
    return (
        <OptionsContext.Provider
            value={{
                filteredIcons,
                searchTerm,
                setSearchTerm: setSearchTerm,
            }}
        >
            {children}
        </OptionsContext.Provider>
    );
};

const useOptions = () => {
    return useContext(OptionsContext);
};

const SearchIcon = () => {
    const { setSearchTerm } = useOptions();
    const changeSearchTerm = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <Input
            className="input-wrap"
            onChange={changeSearchTerm}
            placeholder="Search for Icon"
        />
    );
};

const Cell = ({ columnIndex, rowIndex, style, onSelect, pathName, value }) => {
    const { filteredIcons } = useOptions();
    const icon = filteredIcons[rowIndex * NUM_COLUMNS + columnIndex];
    const isSelected = isEqual(icon?.value, value);

    const selectIcon = (icon) => {
        onSelect({
            name: pathName,
            value: {
                prefix: 'simple',
                iconName: icon.slug,
                type: 'simple',
            },
        });
    };

    if (!icon) {
        return null;
    }

    return (
        <LI
            key={icon.slug}
            isSelected={isSelected}
            style={{
                ...style,
                top: `${parseFloat(style.top) + 5}px`,
                left: `${parseFloat(style.left) + PADDING_SIZE}px`,
            }}
            onClick={() => selectIcon(icon)}
        >
            <svg
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                width={16}
                height={16}
                dangerouslySetInnerHTML={{ __html: icon.svg }}
            />
        </LI>
    );
};

const IconList = ({ onSelect, pathName, value }) => {
    const { filteredIcons } = useOptions();
    return (
        <div style={{ overflow: 'hidden' }}>
            <Grid
                columnCount={NUM_COLUMNS}
                columnWidth={41}
                height={200}
                rowCount={Math.ceil(filteredIcons.length / NUM_COLUMNS) ?? 1}
                rowHeight={40}
                width={328}
                innerElementType={innerElementType}
            >
                {({ columnIndex, rowIndex, style }) => (
                    <Cell
                        columnIndex={columnIndex}
                        rowIndex={rowIndex}
                        style={style}
                        onSelect={onSelect}
                        pathName={pathName}
                        value={value}
                    />
                )}
            </Grid>
        </div>
    );
};

export default function SimpleIcons(props) {
    return (
        <OptionsProvider>
            <div>
                <SearchIcon />
                <IconList
                    onSelect={props.onChange}
                    pathName={props.name}
                    value={props.value}
                />
            </div>
        </OptionsProvider>
    );
}

const innerElementType = forwardRef(({ style, ...rest }, ref) => (
    <div
        ref={ref}
        style={{
            ...style,
            height: `${parseFloat(style.height) + PADDING_SIZE * 2}px`,
        }}
        {...rest}
    />
));
