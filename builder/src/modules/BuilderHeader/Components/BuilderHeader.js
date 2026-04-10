import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { antToken } from '../../../antd.theme';
import TopCenter from './TopCenter';
import TopRight from './TopRight';
import Topleft from './Topleft';

const BuilderHeaderStc = styled.div`
    &&& {
        height: 100%;

        & .topLeft,
        .topCenter,
        .topRight {
            flex: 1 1 33%;
            height: 100%;
            margin-top: -4px;
        }
        & .topLeft {
            padding-left: 8px;
        }
        & .topCenter {
            margin-top: 0px;
            display: flex;
            justify-content: center;
        }

        & .topRight {
            padding-right: 8px;
        }

        .ant-btn-text svg {
            color: ${antToken.colorTextDescription};
        }
    }
`;

/**
 * Represents a component that receives props from Builder.js.
 *
 * @component
 *
 * @typedef {Object} builderProps
 * @property {Boolean} authUser - Indicates whether the user is authenticated or not.
 * @property {HTMLAnchorElement} Link - An HTML anchor element for navigation.
 *
 * @param {Object} props - The props for this component.
 * @param {builderProps} props.builderProps - Props passed from Builder.js.
 *
 * @returns {JSX.Element} A JSX element representing this component.
 */

function BuilderHeader(props) {
    const { t } = useTranslation('builder');
    return (
        <BuilderHeaderStc>
            <Row
                style={{
                    height: '100%',
                }}
                align="middle"
                wrap={false}
            >
                <Col className="topLeft">
                    <Topleft {...props} t={t} />
                </Col>
                <Col className="topCenter">
                    <TopCenter t={t} />
                </Col>
                <Col className="topRight">
                    <TopRight {...props} t={t} />
                </Col>
            </Row>
        </BuilderHeaderStc>
    );
}

export default BuilderHeader;
