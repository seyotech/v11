import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Wrap = styled.div`
    display: flex;
    padding: 20px;
    justify-content: center;
`;

function Loading() {
    return (
        <Wrap>
            <FontAwesomeIcon
                spin
                size="2x"
                fixedWidth
                icon={['far', 'spinner']}
            />
        </Wrap>
    );
}

export default Loading;
