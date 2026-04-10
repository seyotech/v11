import { fieldTypesEnum, operatorEnum } from '../constants/cmsData';

const { NUMBER, SINGLE_REFERENCE, MULTI_REFERENCE } = fieldTypesEnum;

const {
    IN,
    NOT_IN,
    LIKE,
    NOT_LIKE,
    EXISTS,
    SET,
    NOT_SET,
    BETWEEN,
    EQUAL_TO,
    LESS_THAN,
    NOT_EQUAL_TO,
    GREATER_THAN,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN_OR_EQUAL_TO,
} = operatorEnum;

export const generateFilterLabel = ({ name, value, operator, type, label }) => {
    const isRef = [SINGLE_REFERENCE, MULTI_REFERENCE].includes(type);
    switch (operator) {
        case LIKE:
            return `${name} includes ${value}`;
        case NOT_LIKE:
            return `${name} doesn't includes ${value}`;
        case EQUAL_TO:
        case IN:
            if (isRef) return `${name} is ${label}`;
            return `${name} is ${value}`;
        case NOT_EQUAL_TO:
        case NOT_IN:
            if (isRef) return `${name} is not ${label}`;
            return `${name} is not ${value}`;
        case EXISTS:
            return `${name} is ${value ? 'set' : 'not set'}`;
        case SET:
            return `${name} is set`;
        case NOT_SET:
            return `${name} is not set`;
        case LESS_THAN_OR_EQUAL_TO:
            return (
                name +
                ' is' +
                (type === NUMBER
                    ? ' less than or equal to '
                    : ' before or equal to ') +
                value
            );
        case GREATER_THAN_OR_EQUAL_TO:
            return (
                name +
                ' is' +
                (type === NUMBER
                    ? ' greater than or equal to '
                    : ' after or equal to ') +
                value
            );

        case LESS_THAN:
            return (
                name +
                ' is' +
                (type === NUMBER ? ' less than ' : ' before ') +
                value
            );
        case GREATER_THAN:
            return (
                name +
                ' is' +
                (type === NUMBER ? ' greater than ' : ' after ') +
                value
            );

        case BETWEEN:
            return `${name} is between ${value?.$gt || -Infinity} and ${
                value?.$lt || Infinity
            }`;

        default:
            throw new Error(`${operator} is not a valid operator`);
    }
};
