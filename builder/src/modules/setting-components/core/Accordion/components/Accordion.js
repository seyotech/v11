/*****************************************************
 * Packages
 ******************************************************/
import T from 'prop-types';
import { useContext, useRef } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from 'contexts/BuilderContext';
import { EditorContext } from 'contexts/ElementRenderContext';
import useEditorModal from 'hooks/useEditorModal';
import AntCollapse from 'modules/Shared/AntCollapse';
import { useTranslation } from 'react-i18next';
import { GroupBody } from '../../GroupBody/components';
import { filterByConditions } from '../utils/filterByConditions';

export function Accordion({ onSaveSettings, settingsContent, sidebar }) {
    const { appName } = useContext(BuilderContext);
    const { t } = useTranslation('builder');
    const simpleBarRef = useRef();

    const { currentEditItem, user } = useContext(EditorContext);
    const { isSidebar } = useEditorModal();

    const items = settingsContent
        .filter((group) =>
            filterByConditions({ group, appName, currentEditItem, user })
        )
        .map((group, key) => {
            return {
                ...group,
                key,
                label: t(group.label),
                role: `setting-collapse-item`,
                'aria-label': group.label,
                children: (
                    <GroupBody
                        isSidebar={isSidebar}
                        group={{ ...group, isRootLabel: true }}
                        handleChange={onSaveSettings}
                    />
                ),
            };
        });

    return (
        <SimpleBar
            ref={simpleBarRef}
            style={{
                maxHeight: sidebar ? 'auto' : '460px',
                height: sidebar ? '100%' : '460px',
            }}
        >
            <AntCollapse
                items={items}
                showArrow={false}
                defaultActiveKey={[0]}
            />
            <div style={{ height: 40 }} />
        </SimpleBar>
    );
}

Accordion.propTypes = {
    sidebar: T.bool,
    onSaveSettings: T.func.isRequired,
    settingsContent: T.array.isRequired,
};
