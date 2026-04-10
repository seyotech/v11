import { useContext, forwardRef, memo } from 'react';
import { Tooltip, Button } from 'antd';
import styled from 'styled-components';
import { editorType } from '../../../util/constant';
import useEditorModal from '../../../hooks/useEditorModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RENAME_ELEMENT } from '../.././../constants';
import { ElementContext } from '../../../contexts/ElementRenderContext';
const { SIDEBAR, MODAL } = editorType;

function getPad({ size }) {
    switch (size) {
        case 'md':
            return '30px';

        case 'sm':
        default:
            return '20px';
    }
}

const Icon = styled.div`
    .icon {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .icon-times {
        width: 21px;
        height: 21px;
        margin-top: 3px;
    }
`;

const Header = styled.div`
    border-radius: ${({ isSidebar }) => (isSidebar ? 0 : '5px 5px 0 0')};
    box-shadow: ${({ theme }) => `0 1px 1px 0 ${theme.inputBorder}`};
    cursor: ${({ isSidebar }) => (isSidebar ? 'default' : 'move')};
    background: ${({ theme }) => theme.primary.bg};
    color: ${({ theme }) => theme.bodyText};
    justify-content: space-between;
    padding: 0 ${getPad};
    margin-bottom: 2px;
    align-items: center;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.animated {
        animation: sidebarAnimation 1s linear;
    }
`;
const Title = styled.div`
    text-transform: uppercase;
    color: ${({ theme }) => theme.titleText};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
`;
const ActionArea = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: default;
    justify-content: space-between;
    padding-left: 16px;
`;

const ModalTitle = ({ title, isRenameable, isSidebar }) => {
    const { onClickContextMenu } = useContext(ElementContext);
    if (!isRenameable) return <Title>{title}</Title>;
    return (
        <Title>
            <span
                style={{
                    maxWidth: isSidebar ? '135px' : '150px',
                    display: 'inline-block',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                }}
                title={title}
            >
                {title}
            </span>
            <Button
                type="text"
                style={{
                    margin: '0 5px',
                    fontSize: '12px',
                    padding: '0 5px',
                }}
                onClick={() => onClickContextMenu(RENAME_ELEMENT)}
            >
                <FontAwesomeIcon icon={['fas', 'pen']} />
            </Button>
        </Title>
    );
};
const ModalHeader = forwardRef(
    ({ close, sidebarIcon = true, isRenameable, title, ...rest }, ref) => {
        const { editorLayout, handleEditorLayout, isSidebar } =
            useEditorModal();
        const { handleBuilderLayout } = useContext(ElementContext);
        const handleLayout = () => {
            let value =
                editorLayout && editorLayout !== SIDEBAR ? SIDEBAR : MODAL;
            handleEditorLayout(value);
            handleBuilderLayout(value);
        };

        const tooltipTitle = isSidebar
            ? 'Move to Editor Modal'
            : 'Move to Sidebar Editor';

        return (
            <Header ref={ref} {...rest} isSidebar={isSidebar}>
                <ModalTitle
                    isRenameable={isRenameable}
                    title={title}
                    isSidebar={isSidebar}
                />
                <ActionArea {...rest}>
                    {sidebarIcon && (
                        <Tooltip
                            placement="left"
                            trigger="hover"
                            title={tooltipTitle}
                        >
                            <Icon onClick={handleLayout}>
                                {isSidebar ? (
                                    <FontAwesomeIcon
                                        className="icon"
                                        icon={['fad', 'window-restore']}
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        className="icon"
                                        icon={['fa', 'columns']}
                                    />
                                )}
                            </Icon>
                        </Tooltip>
                    )}
                    <Icon onClick={close}>
                        <FontAwesomeIcon
                            className="icon icon-times"
                            icon={['fal', 'times']}
                        />
                    </Icon>
                </ActionArea>
            </Header>
        );
    }
);

export default memo(ModalHeader);
