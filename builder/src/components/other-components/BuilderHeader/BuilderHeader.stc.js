import styled from 'styled-components';

export const BuilderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    background: ${({ theme }) => theme.headerBg};
    box-shadow: 0px 2px 8px 0px rgba(43, 53, 86, 0.05);
`;

export const HeaderNav = styled.div`
    text-align: ${({ isLast }) => isLast && 'right'};
    margin-right: ${({ isLast }) => isLast && '30px'};
    flex: ${({ isFirst, isLast }) => (isFirst || isLast ? 1 : '')};
`;

export const NavUl = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;

    > li {
        height: 50px;
        min-width: 60px;
        font-weight: 400;
        line-height: 50px;
        text-align: center;
        position: relative;
        display: inline-block;
        color: ${({ theme }) => theme.bodyText};
        border-left: 1px solid ${({ theme }) => theme.borderPaleGrey};

        &:not(.as-text) {
            cursor: pointer;
        }

        &:hover:not(.as-text):not(.active) {
            color: ${({ theme }) => theme.primary.fg};
        }

        &[disabled] {
            opacity: 0.7;
            cursor: not-allowed;
        }

        &:last-child {
            border-right: 2px solid ${({ theme }) => theme.borderPaleGrey};
        }

        :not(.button-wrapper) {
            padding: 0 20px;
        }

        &.button-wrapper button {
            border: 0;
            cursor: pointer;
            background: none;
            padding: 0 21px;

            &[disabled] {
                cursor: not-allowed;
            }
        }
        &._jr-page-settings button {
            padding: 0;
        }

        &.nav-dropdown {
            li {
                line-height: 1.5;
            }
        }

        .nav-dropdown__btn {
            color: ${({ theme }) => theme.primary.fg};
        }

        &.logo {
            padding: 0px 8px;
            min-width: auto;
        }

        &.active {
            color: ${({ theme }) => theme.primary.bg};
            background: ${({ theme }) => theme.primary.fg};

            + li {
                border-left-color: ${({ theme }) => theme.primary.fg};
            }
        }
    }
    &.page-settings {
        > li {
            padding: 0 10px;
            &.logo {
                padding: 0px 6px;
            }
        }
    }

    &.device {
        > li {
            font-size: 18px;
            color: ${({ theme }) => theme.bodyText};

            &.active {
                color: ${({ theme }) => theme.primary.bg};
                background: ${({ theme }) => theme.primary.fg};

                + li {
                    border-left-color: ${({ theme }) => theme.primary.fg};
                }
            }
        }
    }

    .sidebar-active-item {
        max-width: 100px;
        overflow: hidden;
        white-space: nowrap;
        display: inline-flex;
        text-overflow: ellipsis;
    }
`;
