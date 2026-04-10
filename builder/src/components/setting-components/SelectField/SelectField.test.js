import React from 'react';
import { render, screen, within, userEvent } from '@/util/test-utils';

import SelectField from './SelectField';
import CreateCMSRow from '@/util/CreateCMSRow';
import {
    operatorEnum,
    fieldTypesEnum,
    textFilterOperators,
    numberFilerOperators,
    commonFilterOperators,
    textOnlyFilterOperators,
} from '../../../constants/cmsData';
import { mockFields, mockFilter } from '../../../__mocks__/consts/cmsData';
import { EditorContextProvider } from '../../../contexts/ElementRenderContext';

let currentEditItem = {
    ...new CreateCMSRow('CMSROW'),
    configuration: {
        source: 'TOPIC',
        connected: true,
        selectedCollection: { slug: 'client' },
    },
};

const mockOnChange = vi.fn();

vi.mock('../../../hooks/useCMS', () => {
    return {
        default: () => {
            return {
                useSourceOptions: vi.fn(() => ({
                    options: [],
                    refetch: vi.fn(),
                })),
                useGetTopicBySlug: vi.fn(() => ({ options: mockFields })),
            };
        },
    };
});

const Wrapper = ({ children }) => (
    <EditorContextProvider value={{ currentEditItem }}>
        {children}
    </EditorContextProvider>
);

describe('Select Field', () => {
    test('should render "Select Field" input field into the DOM', () => {
        render(<SelectField />, { wrapper: Wrapper });
        const selectField = screen.getByPlaceholderText(/select a field/i);
        expect(selectField).toBeInTheDocument();
    });

    test('should render "Select Field" input field in unselected', () => {
        render(<SelectField />, { wrapper: Wrapper });
        const selectField = screen.getByTestId(/not-selected/i);
        expect(selectField).toBeInTheDocument();
    });

    test.each(['email', 'name', 'age'])(
        'should render "Select Field" input field with "%s" selected value',
        (selected) => {
            render(<SelectField value={{ operators: '', name: selected }} />, {
                wrapper: Wrapper,
            });
            const selectField = screen.getByTestId(/selected/i);
            expect(selectField).toHaveValue(selected);
        }
    );
});

describe('Select Field Operator', () => {
    test('should render $like operator', () => {
        mockOnChange.mockClear();

        render(
            <SelectField
                value={{
                    name: 'slug',
                    value: 'hello',
                    type: fieldTypesEnum.TEXT,
                    operator: operatorEnum.LIKE,
                }}
                onChange={mockOnChange}
            />,
            {
                wrapper: Wrapper,
            }
        );

        const [_, select] = screen.getAllByRole('combobox');

        expect(select).toBeInTheDocument();
        const like = within(select).getByRole('option', { name: 'Contains' });
        expect(like).toBeInTheDocument();
    });

    test('should not render $link operator', () => {
        let currentEditItem = {
            ...new CreateCMSRow('CMSROW'),
            configuration: {
                source: 'TOPIC',
                connected: true,
                selectedCollection: { slug: 'client' },
            },
            filter: mockFilter,
        };

        const Wrapper = ({ children }) => (
            <EditorContextProvider value={{ currentEditItem }}>
                {children}
            </EditorContextProvider>
        );
        mockOnChange.mockClear();

        render(
            <SelectField
                value={{
                    name: 'slug',
                    type: 'TEXT',
                    value: 'hello world',
                    operator: operatorEnum.EQUAL_TO,
                }}
                onChange={mockOnChange}
            />,
            {
                wrapper: Wrapper,
            }
        );

        const [_, select] = screen.getAllByRole('combobox');

        expect(select).toBeInTheDocument();
        const like = within(select).queryByRole('option', { name: 'Like' });
        expect(like).not.toBeInTheDocument();
    });

    test('should render $nlink operator', () => {
        mockOnChange.mockClear();

        render(
            <SelectField
                value={{
                    operator: '$nlike',
                    name: 'slug',
                    type: fieldTypesEnum.TEXT,
                    value: 'hello',
                }}
                onChange={mockOnChange}
            />,
            {
                wrapper: Wrapper,
            }
        );

        const [_, select] = screen.getAllByRole('combobox');

        expect(select).toBeInTheDocument();
        const notLike = within(select).getByRole('option', {
            name: 'Does Not Contain',
        });
        expect(notLike).toBeInTheDocument();
    });
});

describe('Filter input fields', () => {
    let currentEditItem = {
        ...new CreateCMSRow('CMSROW'),
        configuration: {
            source: 'TOPIC',
            connected: true,
            selectedCollection: { slug: 'client' },
        },
        filter: mockFilter,
    };

    const Wrapper = ({ children }) => (
        <EditorContextProvider value={{ currentEditItem }}>
            {children}
        </EditorContextProvider>
    );

    beforeEach(() => {
        mockOnChange.mockReset();
    });

    test('should change field type', async () => {
        render(
            <SelectField
                value={{
                    name: 'slug',
                    value: 'hello world',
                    type: fieldTypesEnum.NUMBER,
                    operator: operatorEnum.EQUAL_TO,
                }}
                onChange={mockOnChange}
            />,
            {
                wrapper: Wrapper,
            }
        );

        const [select1, select2] = screen.getAllByRole('combobox');
        await userEvent.selectOptions(select1, ['email']);

        const options1 = within(select2).getAllByRole('option');
        expect(options1).toHaveLength(
            textFilterOperators
                .concat(commonFilterOperators)
                .concat(textOnlyFilterOperators).length
        );
        await userEvent.selectOptions(select1, ['age']);
        const options2 = within(select2).getAllByRole('option');
        expect(options2).toHaveLength(
            numberFilerOperators.concat(commonFilterOperators).length
        );
    });

    test('should change operator type', async () => {
        render(
            <SelectField
                value={{
                    name: 'slug',
                    value: 'hello world',
                    type: fieldTypesEnum.NUMBER,
                    operator: operatorEnum.EQUAL_TO,
                }}
                onChange={mockOnChange}
            />,
            {
                wrapper: Wrapper,
            }
        );

        const [, select] = screen.getAllByRole('combobox');
        await userEvent.selectOptions(select, [operatorEnum.LESS_THAN]);

        const equalField = screen.getByPlaceholderText('example: 20');

        expect(equalField).toBeInTheDocument();

        await userEvent.selectOptions(select, [operatorEnum.BETWEEN]);
        const lessThanField = screen.getByPlaceholderText('example: 100');
        const greaterThanField = screen.getByPlaceholderText('example: 10');

        expect(lessThanField).toBeInTheDocument();
        expect(greaterThanField).toBeInTheDocument();
    });

    test('should change input value', async () => {
        const value = {
            name: 'age',
            value: '30',
            type: fieldTypesEnum.NUMBER,
            operator: operatorEnum.EQUAL_TO,
        };

        render(<SelectField value={value} onChange={mockOnChange} />, {
            wrapper: Wrapper,
        });

        const equalField = screen.getByPlaceholderText('example: 20');

        expect(equalField).toHaveValue(Number(value.value));
        const newValue = '100';

        await userEvent.clear(equalField);
        await userEvent.type(equalField, newValue);
        expect(equalField).toHaveValue(Number(newValue));
    });
});
