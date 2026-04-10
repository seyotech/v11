import { Button, Row, Col, Form } from 'antd';

export const Footer = ({
    okButtonText,
    cancelButtonText,
    okButtonProps = {},
    cancelButtonProps = {},
}) => {
    return (
        <Row justify={'end'} gutter={8}>
            <Col>
                <Button {...cancelButtonProps}>{cancelButtonText}</Button>
            </Col>
            <Col>
                <Button
                    htmlType="submit"
                    {...okButtonProps}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {okButtonText}
                </Button>
            </Col>
        </Row>
    );
};
