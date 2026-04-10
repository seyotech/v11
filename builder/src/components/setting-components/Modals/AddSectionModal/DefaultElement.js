import React from 'react';
import styled from 'styled-components';

import { Body } from './AddSectionModal.stc';
import { filterElement } from '../../../../util/filterElements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BuilderContext } from '../../../../contexts/BuilderContext';
import { ElementContext } from '../../../../contexts/ElementRenderContext';

const Section = styled(Body)`
    display: grid;
    grid-gap: 25px;
    grid-template-columns: repeat(4, 1fr);
`;
const ElementItem = styled.div`
    padding: 20px;
    cursor: pointer;
    text-align: center;
    position: relative;
    border-radius: 5px;
    color: var(--color-body-text-300);
    border: 2px solid ${({ theme }) => theme.borderPaleGrey};

    p,
    svg {
        opacity: ${({ isActive }) => (isActive ? '1' : '0.5')};
    }

    .pro-element {
        top: 5px;
        right: 5px;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        padding: 3px 6px;
        position: absolute;
        border-radius: 3px;
        display: inline-block;
        background: var(--color-primary-500);
    }
`;
const Text = styled.p`
    margin: 10px 0 0;
    /* color: var(--color-text-700); */
`;

function Element({ item, validateMembership }) {
    const { data, membership, badgeText } = item;
    const isVisibleElement = validateMembership(membership);
    const { user } = React.useContext(BuilderContext);
    const { addElement } = React.useContext(ElementContext);
    const isPaidUser = !!(
        user?.meta?.plan?.planId || user?.meta?.membership?.planId
    );
    const isBadgeRanderable = membership && !isPaidUser;

    // TODO: Prevent CMS from rendering paid elements
    // const { permission } = useContext(ComponentRenderContext);
    // permission.render(data?.type);

    const handleClick = React.useCallback(
        () =>
            isVisibleElement
                ? addElement({ data, elType: data._elType })
                : window.open('/dashboard/account/billing', '_blank'),
        [addElement, data, isVisibleElement]
    );

    return (
        <ElementItem isActive={isVisibleElement} onClick={handleClick}>
            {isBadgeRanderable && (
                <span title="Paid Element" className="pro-element">
                    Paid
                </span>
            )}
            <FontAwesomeIcon
                size="2x"
                fixedWidth
                icon={item.icon}
                className="icon"
            />
            <Text>{item.title}</Text>
        </ElementItem>
    );
}

function DefaultElement({
    data = [],
    page,
    appName,
    isCmsRow,
    elementType,
    ...restOfProps
}) {
    // const isSearchEnabled = useFeatureFlag(featureFlagEnums.SEARCH);
    const sortedByName = React.useMemo(() => {
        let elements = data.sort((a, b) => a.title.localeCompare(b.title));
        elements = elements.filter((element) =>
            filterElement({
                element,
                appName,
                isCmsRow,
                elementType,
                pageType: page.pageType,
            })
        );

        // if (!isSearchEnabled) {
        //     elements = elements.filter(
        //         (element) =>
        //             !['search', 'searchWidget'].includes(element.data.type)
        //     );
        // }

        elements = elements.filter(
            (element) => !['search', 'searchWidget'].includes(element.data.type)
        );

        return elements;
    }, [data, appName, isCmsRow, elementType, page.pageType]);

    return (
        <Section>
            {sortedByName.map((item, idx) => (
                <Element key={idx} item={item} {...restOfProps} page={page} />
            ))}
        </Section>
    );
}

export default DefaultElement;
