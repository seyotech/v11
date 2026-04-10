import React from 'react';
import { Input, Select } from 'antd';

import {
    operatorEnum,
    fieldTypesEnum,
    dateFilterOperators,
    textFilterOperators,
    numberFilerOperators,
    multiFilterOperators,
    commonFilterOperators,
    textOnlyFilterOperators,
} from '../../../constants/cmsData';
import { Between } from './Between';
import { DateInput } from './DateInput';
import { Reference } from './Reference';
import { FieldWrapper } from './FieldWrapper';

const {
    TEXT,
    DATE,
    LINK,
    IMAGE,
    NUMBER,
    RICH_TEXT,
    MULTI_SELECT,
    MULTI_REFERENCE,
    SINGLE_REFERENCE,
} = fieldTypesEnum;

const skipOperators = [operatorEnum.SET, operatorEnum.NOT_SET];

const shouldRender = (operators, operator) =>
    operators.find(({ value }) => value === operator);

const shouldSkip = (operator, type) => {
    switch (type) {
        case LINK:
        case IMAGE:
        case RICH_TEXT:
            return true;
        case TEXT:
            return !shouldRender(
                textFilterOperators.concat(textOnlyFilterOperators),
                operator
            );
        case NUMBER:
            return !shouldRender(numberFilerOperators, operator);
        case DATE:
            return !shouldRender(dateFilterOperators, operator);
        case MULTI_SELECT:
            return !shouldRender(multiFilterOperators, operator);
        case SINGLE_REFERENCE:
            return !shouldRender(
                textFilterOperators.concat(commonFilterOperators),
                operator
            );
        case MULTI_REFERENCE:
            return !shouldRender(
                multiFilterOperators.concat(commonFilterOperators),
                operator
            );
        default:
            return !shouldRender(textFilterOperators, operator);
    }
};

export const RenderFilterField = ({ type, operator, topicId, name }) => {
    if (!operator || skipOperators.includes(operator)) return null;

    if (shouldSkip(operator, type)) return null;
    switch (type) {
        case NUMBER:
            if (operator === '$between') return <Between />;
            return (
                <FieldWrapper>
                    <Input type="number" placeholder="example: 20" />
                </FieldWrapper>
            );

        case DATE:
            return (
                <FieldWrapper>
                    <DateInput />
                </FieldWrapper>
            );

        case MULTI_SELECT:
            return (
                <FieldWrapper>
                    <Select mode="tags" placeholder="Type and enter" />
                </FieldWrapper>
            );
        case MULTI_REFERENCE:
        case SINGLE_REFERENCE:
            return (
                <FieldWrapper
                    rules={[
                        {
                            required: true,
                            message: 'This field is required',
                        },
                    ]}
                >
                    <Reference topicId={topicId} name={name} />
                </FieldWrapper>
            );

        default:
            return (
                <FieldWrapper>
                    <Input placeholder="example: hello world" />
                </FieldWrapper>
            );
    }
};
