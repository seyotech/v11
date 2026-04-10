import { t } from 'i18next';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import styled from 'styled-components';

const Div = styled.div`
    ul {
        margin: 0;
        font-size: 13px;
        padding: 0 0 0 20px;
    }
`;

export function HelpText(props) {
    const { message } = props;

    return (
        <RenderComponentWithLabel {...props}>
            <Div dangerouslySetInnerHTML={{ __html: t(message) }}></Div>
        </RenderComponentWithLabel>
    );
}
