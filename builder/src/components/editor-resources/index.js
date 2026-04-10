import list from './list';
import attrEditResources from './attr-edit-resources';
import styleEditResource from './style-edit-resources';
import wrapperEditResources from './wrapper-edit-resources';
import settingsEditResources from './settings-edit-resources';
import basePropEditResources from './base-prop-edit-resources';

const dropdown = {
    ...list,
    itemStyle: styleEditResource,
};
const tabs = {
    tabsStyle: styleEditResource,
    activeStyle: styleEditResource,
    contentStyle: styleEditResource,
};
const paginationStyle = {
    style: styleEditResource,
    wrapperStyle: styleEditResource,
};
const moveToTop = {
    buttonStyle: styleEditResource,
};
const emptyDataStyles = {
    style: styleEditResource,
};
const row = {
    closeButton: styleEditResource,
    popupStyle: styleEditResource,
    filterStyle: {
        radioButtonStyle: styleEditResource,
        rangeStyle: {
            inputStyle: styleEditResource,
            inputLabelStyle: styleEditResource,
            thumbStyle: styleEditResource,
            trackRailStyle: styleEditResource,
            containerStyle: styleEditResource,
        },
        style: styleEditResource,
    },
};

const editorResources = {
    row,
    btn: list,
    paginationStyle,
    emptyDataStyles,
    attr: attrEditResources,
    style: styleEditResource,
    wrapper: wrapperEditResources,
    settings: settingsEditResources,
};

export default editorResources;
