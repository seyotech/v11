import React from 'react';

import getPathValue from '../../util/getPathValue';
import settingComponents from './index';
import isObject from '../../util/isObject';
import WithLabel from './WithLabel';
import getPath from '../../util/getPath';
import moduleResources from '../editor-resources';

const getModuleData = (module) => {
    if (typeof module === 'string') {
        return getPathValue(module, moduleResources);
    }
    if (isObject(module)) {
        const resourceData = getPathValue(module.path, moduleResources);
        const { path, ...moduleData } = module;
        return { ...resourceData, ...moduleData };
    }
};

const RenderTemplate = ({ modules, ...restOfProps }) => {
    const { onChange, valueStore } = restOfProps;
    return modules.map((mod, modIndex) => {
        if (mod.template) {
            const Component = settingComponents[mod.template];
            return (
                <WithLabel label={mod.label} module={mod} key={modIndex}>
                    <Component
                        {...mod}
                        name={mod.key}
                        onChange={onChange}
                        value={valueStore.get(mod.key)}
                    />
                </WithLabel>
            );
        }
        if (mod.modules) {
            return (
                <RenderTemplate
                    {...restOfProps}
                    modules={mod.modules}
                    key={modIndex}
                />
            );
        }

        // no template or module found!
        return null;
    });
};

const Mappable = ({ module, handleChange, currentEditItem }) => {
    const path = getPath(module);
    const { modules } = getModuleData(module);
    const value = getPathValue(path, currentEditItem);
    const valueStore = new Map(value);

    const onChange = (payload) => {
        const { name, value } = payload;
        valueStore.set(name, value);
        handleChange({ name: path, value: Array.from(valueStore) });
    };

    return (
        <RenderTemplate
            modules={modules}
            onChange={onChange}
            valueStore={valueStore}
        />
    );
};
export default Mappable;
