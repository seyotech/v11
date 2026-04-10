/* eslint-disable testing-library/no-node-access */
import { buildQueries } from '@testing-library/react';

const queryAllByClassName = (className) => [
    ...document.querySelectorAll(`.${className}`),
];

const getMultipleError = (_, className) =>
    `Found multiple elements with the className  of: ${className}`;

const getMissingError = (_, className) =>
    `Unable to find an element with the className of: ${className}`;

const [
    getByClassName,
    findByClassName,
    queryByClassName,
    getAllByClassName,
    findAllByClassName,
] = buildQueries(queryAllByClassName, getMultipleError, getMissingError);

const getAllByIconName = (iconName) => [
    ...document.querySelectorAll(`[data-icon='${iconName}']`),
];

const getByIconName = (iconName) =>
    document.querySelector(`[data-icon='${iconName}']`);

const getByCustomSelector = (selector) => document.querySelector(selector);

export {
    findAllByClassName,
    findByClassName,
    getAllByClassName,
    getAllByIconName,
    getByClassName,
    getByCustomSelector,
    getByIconName,
    queryAllByClassName,
    queryByClassName,
};
