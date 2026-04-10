import React, { useContext } from 'react';
import condition from 'dynamic-condition';
import { Collapse, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
/*****************************************************
 * Locals
 ******************************************************/
import settingComponents from '../index';
import RenderModule from './RenderModule';
import resolveValues from '../../../util/resolveValues';
import getHoverStateConditions from 'util/getHoverStateConditions';
import { GroupContainer } from '../../../modules/Shared/GroupContainer';
import { AntCollapseAltStc } from '../../../modules/Shared/AntCollapse/index.stc';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import { BuilderContext } from 'contexts/BuilderContext';

const RenderTemplate = React.memo(function _RenderTemplate(props) {
    const { module, parentModule, index, ...restOfProps } = props;
    const { data, display, activeHover } = restOfProps;
    const { appName, user } = useContext(BuilderContext);
    const { t } = useTranslation();
    // const enabled = useFlag(COLLECTION_FILTER);

    // if (!enabled && module.group && module.label === FILTER) {
    //     return null;
    // }

    const { moduleFilter } = module;
    if (moduleFilter && !moduleFilter({ data, appName, user })) {
        return null;
    }
    const conditions =
        module.conditions &&
        (!activeHover
            ? module.conditions
            : getHoverStateConditions(module.conditions, 'pseudoClass/hover'));

    if (conditions && !condition(resolveValues(conditions, data)).matches) {
        return null;
    }

    if (
        activeHover &&
        module.hasOwnProperty('hoverable') &&
        !module.hoverable
    ) {
        return null;
    }

    // Render provided template
    if (module.template) {
        const Component = settingComponents[module.template] || 'div';

        return (
            <Component {...props} display={display} currentEditItem={data} />
        );
    }
    if (module.group) {
        const collapseItems = [
            {
                label: (
                    <Typography.Text style={{ marginLeft: -4 }}>
                        {t(module.label)}
                    </Typography.Text>
                ),
                children: (
                    <GroupContainer className="divider">
                        {module.modules.map((childMod, idx) => {
                            return (
                                <RenderGroupTemplate
                                    key={idx}
                                    index={idx}
                                    module={childMod}
                                    parentModule={module}
                                    {...childMod}
                                    {...restOfProps}
                                />
                            );
                        })}
                    </GroupContainer>
                ),
            },
        ];
        return (
            <AntCollapseAltStc className="collapse-alt">
                <Collapse size="small" items={collapseItems} />
            </AntCollapseAltStc>
        );
    }

    if (module.modules) {
        return (
            <RenderComponentWithLabel {...props}>
                <GroupContainer className="divider">
                    {module.modules.map((childMod, modIndex) => (
                        <RenderTemplate
                            key={modIndex}
                            index={modIndex}
                            module={childMod}
                            parentModule={module}
                            {...restOfProps}
                        />
                    ))}
                </GroupContainer>
            </RenderComponentWithLabel>
        );
    } else {
        return (
            <RenderModule
                {...props}
                data={data}
                display={display}
                parentModule={parentModule}
            />
        );
    }
});

export default RenderTemplate;

const RenderGroupTemplate = (props) => {
    const { module, parentModule, index, ...restOfProps } = props;
    const { data, display, activeHover } = restOfProps;

    const conditions =
        module.conditions &&
        (!activeHover
            ? module.conditions
            : getHoverStateConditions(module.conditions, 'pseudoClass/hover'));

    if (conditions && !condition(resolveValues(conditions, data)).matches) {
        return null;
    }

    if (
        activeHover &&
        module.hasOwnProperty('hoverable') &&
        !module.hoverable
    ) {
        return null;
    }

    if (module.template) {
        const Component = settingComponents[module.template] || 'div';

        return (
            <Component {...props} display={display} currentEditItem={data} />
        );
    }
    if (module.group) {
        const collapseItems = [
            {
                label: (
                    <Typography.Text style={{ marginLeft: -4 }}>
                        {module.label}
                    </Typography.Text>
                ),
                children: (
                    <GroupContainer className="divider">
                        {module.modules.map((childMod, idx) => {
                            return (
                                <RenderGroupTemplate
                                    key={idx}
                                    index={idx}
                                    module={childMod}
                                    parentModule={module}
                                    data={data}
                                    {...childMod}
                                    {...restOfProps}
                                />
                            );
                        })}
                    </GroupContainer>
                ),
            },
        ];
        return (
            <AntCollapseAltStc className="collapse-alt">
                <Collapse size="small" items={collapseItems} />
            </AntCollapseAltStc>
        );
    }
    if (module.modules) {
        return (
            <RenderComponentWithLabel {...props}>
                <GroupContainer className="divider">
                    {module.modules.map((childMod, modIndex) => (
                        <RenderTemplate
                            key={modIndex}
                            index={modIndex}
                            module={childMod}
                            parentModule={module}
                            {...restOfProps}
                        />
                    ))}
                </GroupContainer>
            </RenderComponentWithLabel>
        );
    } else {
        return (
            <RenderModule
                {...props}
                data={data}
                module={module}
                display={display}
                parentModule={parentModule}
            />
        );
    }
};
