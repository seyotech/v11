import styled from 'styled-components';
import React from 'react';

import RenderTemplate from './core/RenderTemplate';

const Wrap = styled.div`
    display: grid;
    grid-column-gap: 15px;
    grid-template-columns: repeat(2, 1fr);
`;

const FontSpaceLH = ({ module, ...restOfProps }) => {
    const { modules } = module;
    return (
        <Wrap>
            {modules.map((mod, modIndex) => (
                <RenderTemplate {...restOfProps} module={mod} key={modIndex} />
            ))}
        </Wrap>
    );
};

export default React.memo(FontSpaceLH);
