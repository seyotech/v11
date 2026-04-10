import { Button } from 'antd';
import { AddContainerElement } from 'modules/CanvasElementRenderer/components/AddContainerElement';
import React from 'react';
import { useTranslation } from 'react-i18next';

const text = {
    page: 'New Section',
    pageDrop: 'Section',
    section: 'Row with Columns',
    row: 'Columns',
    column: 'Element',
    heading: {
        section: 'Drop a Row',
        row: 'Drop a Column',
        column: 'Drop an Element',
    },
    container: 'Element',
};

const ButtonAddNew = ({ onClick, type, address }) => {
    const { t } = useTranslation('builder');
    const addressLength = address?.split('.').length;
    const btnSize = addressLength > 3 ? 'small' : 'large';

    return ['container', 'section'].includes(type) ? (
        <AddContainerElement type={type} onContainerAdd={onClick} />
    ) : (
        <Button
            type="primary"
            size={btnSize}
            onClick={onClick}
            data-testid="add-element"
        >
            {!addressLength || addressLength <= 3
                ? `${t('Add {{type}}', { type: text[type] })}`
                : '+'}
        </Button>
    );
};

export default React.memo(ButtonAddNew);
