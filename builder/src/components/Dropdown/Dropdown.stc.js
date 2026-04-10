import styled from 'styled-components';

export const Wrapper = styled.div`
    width: 270px;
    font-size: 16px;
    padding-bottom: 15px;
`;

export const ContextWrapper = styled.div`
    width: 270px;
    font-size: 18px;
    font-weight: 500;
`;
export const ListItem = styled.li`
    text-align: left;
    cursor: default;
    border-top: 1px solid var(--color-border-500);
    list-style: none;

    &:first-child {
        border-color: transparent;
    }

    svg {
        font-size: 18px;
        margin-right: 15px;
        color: var(--color-text-300);
    }

    > a,
    > span {
        display: block;
        padding: 15px 30px;
        color: var(--color-text-500);

        &:not([disabled]) {
            cursor: pointer;

            &:hover {
                text-decoration: none;
                color: var(--color-primary-500);

                svg {
                    color: var(--color-primary-500);
                }
            }
        }

        &[disabled] {
            opacity: 0.4;
            cursor: not-allowed;
        }
    }
`;

export const ContexttListItem = styled.li`
    text-align: left;
    cursor: default;
    border-top: 1px solid #e5ebf0;

    &:first-child {
        border-color: transparent;
    }

    svg {
        font-size: 18px;
        margin-right: 15px;
        color: #757b8a;
    }

    > a,
    > span {
        display: block;
        padding: 12px 30px;
        color: #464a53;

        &:not([disabled]) {
            cursor: pointer;

            &:hover {
                text-decoration: none;
                color: #0062ff;

                svg {
                    color: #0062ff;
                }
            }
        }

        &[disabled] {
            opacity: 0.4;
            cursor: not-allowed;
        }
    }
`;

export const Badge = styled.span``;
