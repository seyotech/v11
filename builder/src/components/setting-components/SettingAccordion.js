import condition from 'dynamic-condition';
import { useCallback, useContext } from 'react';
import { BuilderContext } from '../../contexts/BuilderContext';
import { EditorContext } from '../../contexts/ElementRenderContext';
import useEditorModal from '../../hooks/useEditorModal';
import resolveValues from '../../util/resolveValues';
import Accordion, {
    AccordionDetails,
    AccordionItem,
    AccordionSummary,
} from '../other-components/Accordion';
import GroupBody from './core/GroupBody';

function SettingAccordion({ simpleBarRef, onSaveSettings, settingsContent }) {
    const { appName } = useContext(BuilderContext);

    const { currentEditItem } = useContext(EditorContext);

    const filterByConditions = useCallback(
        (group) => {
            if (!group.conditions) {
                return group.inView ? group.inView.includes(appName) : true;
            }
            const isConditionMatched = condition(
                resolveValues(group.conditions, currentEditItem)
            ).matches;

            return group.inView
                ? group.inView.includes(appName) && isConditionMatched
                : isConditionMatched;
        },
        [appName, currentEditItem]
    );

    const { isSidebar } = useEditorModal();

    const handleExpend = useCallback((e) => {
        const { offsetTop } = e.target.closest('.AccordionSummary');
        if (simpleBarRef.current) {
            setTimeout(() => {
                simpleBarRef.current
                    .getScrollElement()
                    .scrollTo({ top: offsetTop, behavior: 'smooth' });
            }, 0);
        }
    }, []);

    return (
        <Accordion
            onExpend={handleExpend}
            collapsedIcon="plus"
            expendedIcon="minus"
        >
            {settingsContent.filter(filterByConditions).map((group) => {
                return (
                    <AccordionItem key={group.label}>
                        <AccordionSummary
                            isSidebar={isSidebar}
                            className="AccordionSummary"
                        >
                            {group.label}
                        </AccordionSummary>
                        <AccordionDetails isSidebar={isSidebar} gap={8}>
                            <GroupBody
                                isSidebar={isSidebar}
                                group={{ ...group, isRootLabel: true }}
                                handleChange={onSaveSettings}
                            />
                        </AccordionDetails>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}

export default SettingAccordion;
