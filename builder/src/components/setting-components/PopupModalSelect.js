import React, { useContext } from 'react';
import Select from './Select';
import {
    EditorContext,
    ElementContext,
} from '../../contexts/ElementRenderContext';

function PopupModalSelect({ name, value, onChange }) {
    const { currentPage: { data: { content = [] } = {} } = {} } =
        useContext(EditorContext);
    const { symbols } = useContext(ElementContext);

    const symbolSectionParsed = content
        ?.map((item) => {
            if (!item?.symbolId) return item;
            if (symbols[item.symbolId]?.data) {
                return (item = symbols[item.symbolId].data);
            }
        })
        .filter(Boolean);

    const popupRowsOpts = symbolSectionParsed
        ?.flatMap(({ content = [] }) =>
            // temporary solution. need to debug why content is null
            content?.map((item) => {
                if (!item) return;
                if (item.symbolId && symbols[item.symbolId]?.data) {
                    item = symbols[item.symbolId].data;
                }
                const { attr = {}, settings = {} } = item;
                if (settings.popup) {
                    return {
                        value: attr.id,
                        name: attr.id,
                    };
                }
            })
        )
        ?.filter((v) => v);

    const handleChange = ({ value }) => {
        onChange({ name, value });
    };

    return (
        <Select
            onChange={handleChange}
            value={value}
            options={[{ name: 'None', value: '' }, ...popupRowsOpts]}
        />
    );
}

export default PopupModalSelect;
