/*****************************************************
 * Packages
 ******************************************************/
import T from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import { Typography } from 'antd';
import { Segmented } from 'modules/setting-components/Segmented';
import { useTranslation } from 'react-i18next';
import RenderTemplate from '../../../../../components/setting-components/core/RenderTemplate';
import {
    EditorContext,
    ElementContext,
} from '../../../../../contexts/ElementRenderContext';
import { GroupContainer } from '../../../../Shared/GroupContainer';

const SegmentedStc = styled.div`
    margin-bottom: 12px;

    & .ant-segmented {
        width: 100%;

        &-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            & label {
                width: 100%;
            }
        }
    }
`;

export const GroupBody = ({ group, handleChange }) => {
    const [activeHover, setHover] = useState(false);
    const [lastDevice, setLastDevice] = useState('desktop');
    const { handleResponsiveEditorMode } = useContext(ElementContext);
    const { display, currentEditItem } = useContext(EditorContext);
    const { t } = useTranslation('builder');
    const handleSetHover = useCallback(
        ({ value }) => {
            if (value) {
                setLastDevice(display);
                handleResponsiveEditorMode('desktop');
            } else {
                handleResponsiveEditorMode(lastDevice);
            }
            setHover(value);
        },
        [display, handleResponsiveEditorMode, lastDevice]
    );

    const segmentedOptions = [
        {
            label: t('Normal'),
            value: false,
        },
        {
            label: t('Hover'),
            value: true,
        },
    ];

    return (
        <>
            {group.hoverControl !== false && (
                <GroupContainer>
                    <Segmented
                        options={segmentedOptions}
                        onChange={handleSetHover}
                    />
                    {activeHover && (
                        <Typography.Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                        >
                            {t(
                                '* You can only see the items that are visible when you hover over them.'
                            )}
                        </Typography.Text>
                    )}
                    <div />
                </GroupContainer>
            )}

            <GroupContainer className="divider">
                <RenderTemplate
                    module={group}
                    display={display}
                    data={currentEditItem}
                    activeHover={activeHover}
                    handleChange={handleChange}
                />
            </GroupContainer>
        </>
    );
};

GroupBody.propTypes = {
    group: T.object.isRequired,
    handleChange: T.func.isRequired,
};

export default React.memo(GroupBody);
