import styled from 'styled-components';

const UnitInputStc = styled.div`
    &&& {
        .inputNumber {
            & input {
                text-align: ${({ $inputTextAlign }) =>
                    $inputTextAlign || 'center'};
                padding: ${({ $inputTextAlign }) =>
                    $inputTextAlign === 'right'
                        ? '4px 12px 4px 7px'
                        : 'inherit'};
                color: ${({ $isPale, theme }) =>
                    $isPale ? theme.disabledText : 'inherit'};
            }

            & .ant-input-number.ant-input-number-sm {
                &:hover {
                    & input {
                        padding: '4px 20px 4px 7px';
                    }
                }
            }

            .ant-input-number-handler-wrap {
                width: 10px;
            }

            .ant-input-number-wrapper.ant-input-number-group {
                & .ant-input-number-group-addon {
                    padding: 0;
                }
            }
        }

        .unit-btn {
            height: 22px;
            font-size: 10px;
            padding: 0px 2px;
            line-height: 1;
        }
    }
`;

export default UnitInputStc;
