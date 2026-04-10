import React, { useCallback, useMemo } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import getModContent from '../../../util/getModContent';
import getPath from '../../../util/getPath';
import getPathValue from '../../../util/getPathValue';
import RenderComponent from './RenderComponent';
import {
    getActiveStateData,
    getResponsiveValue,
} from 'modules/Shared/util/getConditionalPathAndValue';

const RenderModule = (props) => {
    const {
        data,
        module,
        display,
        activeHover,
        onChange,
        parentModule,
        handleChange = onChange,
    } = props;
    const modContent = useMemo(() => getModContent(module), [module]);
    let path = React.useMemo(() => getPath(module), [module]);
    let value = getPathValue(path, data);
    const { dependentsValue, resetDep = true } = module;
    let copyPath = path;

    const getDependentsPayload = useCallback(
        (dependentsValue, payload) => {
            const getInitValue = ([path, initVal]) => {
                if (!resetDep) {
                    const value = getPathValue(path, data);
                    if (value === undefined) {
                        return { name: path, value: initVal };
                    }
                } else {
                    // if (Array.isArray(initVal)) {
                    //     const found = initVal.find((item) =>
                    //         item[0].includes(payload[0].value)
                    //     );
                    //     if (found) {
                    //         return { name: path, value: found[1] };
                    //     }
                    //     return {
                    //         name: path,
                    //         value: initVal[initVal.length - 1][2],
                    //     };
                    // }
                    // console.log
                    return { name: path, value: initVal };
                }
            };
            return Object.entries(dependentsValue)
                .map(getInitValue)
                .filter((v) => v);
        },
        [data, resetDep]
    );

    const handleChangeWithDependents = useCallback(
        (payload) => {
            payload = Array.isArray(payload) ? payload : [payload];
            if (dependentsValue) {
                const newPayload = [
                    ...payload,
                    ...getDependentsPayload(dependentsValue, payload),
                ];
                handleChange(newPayload);
            } else {
                handleChange(payload);
            }
        },
        [dependentsValue, getDependentsPayload, handleChange]
    );

    /**
     * Create new path for value store
     * Find active state value
     * create active state placeholder value based on real value
     *
     * @param {string} activeState
     * @returns {array} returns an array of new data
     */

    let mqPlaceholder = '';
    const mqEnabled =
        ((parentModule && parentModule.isResponsible) ||
            modContent?.isResponsible) &&
        display !== 'desktop';
    const isHoverEnabled =
        (parentModule && parentModule.hoverable) || modContent?.hoverable;

    // Responsive element value
    if (mqEnabled) {
        [copyPath, value] = getResponsiveValue({
            responsivePath: `media/${display}`,
            path,
            data,
            value,
        });
        // [path, value, mqPlaceholder] = getActiveStateData(`media/${display}`);
    }
    // Hover element value and path
    if (activeHover && isHoverEnabled) {
        [copyPath, value, mqPlaceholder] = getActiveStateData({
            activeState: 'pseudoClass/hover',
            path,
            data,
            value,
        });
    }

    return (
        <RenderComponent
            {...props}
            value={value}
            path={copyPath}
            mqPlaceholder={mqPlaceholder}
            onChange={handleChangeWithDependents}
        />
    );
};

export default React.memo(RenderModule);
