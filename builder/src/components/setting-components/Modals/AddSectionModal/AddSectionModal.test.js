import * as React from 'react';
import AddSectionModal from './AddSectionModal';
import { ThemeProvider } from 'styled-components';
import { themes } from '../../../../contexts/ThemeContext';
import { render, screen } from '@/util/test-utils';
import { BuilderContextProvider } from '../../../../contexts/BuilderContext';
import { ElementContextProvider } from '../../../../contexts/ElementRenderContext';

const mockOnClose = vi.fn();
const mockHandleBuilderLayout = vi.fn();
const mockGetVisibleElements = vi.fn();
const mockGetElements = vi.fn();

const elementContextValue = {
    handleBuilderLayout: mockHandleBuilderLayout,
};
const builderContextValue = {
    elementTypes: [],
    getVisibleElements: mockGetVisibleElements,
    getElements: mockGetElements,
};
const data = {
    onClose: mockOnClose,
    page: {},
};

let Wrapper = ({ children }) => (
    <ThemeProvider theme={themes.light}>
        <BuilderContextProvider value={builderContextValue}>
            <ElementContextProvider value={elementContextValue}>
                {children}
            </ElementContextProvider>
        </BuilderContextProvider>
    </ThemeProvider>
);
describe('Test for SECTION', () => {
    const value = { ...data, editAddress: '0', type: 'SECTION' };

    it('it should add type SECTION', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });
        expect(screen.getByText(`Add new SECTION`)).toBeInTheDocument();
    });

    it('should render single contentview comp', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });
        const wrappers = screen.getAllByTestId(/wrapper/);
        expect(wrappers).toHaveLength(1);
    });

    it('should render with 4 tab options', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });

        expect(screen.getByText(`Section Library`)).toBeInTheDocument();
        expect(screen.getByText(`Section Symbols`)).toBeInTheDocument();
        expect(screen.getByText(`Saved Sections`)).toBeInTheDocument();
        expect(screen.getByText(`Pre Designed Sections`)).toBeInTheDocument();
    });
});

describe('Test for ROW', () => {
    const value = { ...data, editAddress: '0.0', type: 'ROW' };
    it('it should add type ROW', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });
        expect(screen.getByText(`Add new ROW`)).toBeInTheDocument();
    });

    it('should render 2 contentview comp', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });

        const wrappers = screen.getAllByTestId(/wrapper/);

        expect(wrappers).toHaveLength(2);

        expect(
            screen.getByText(`Row with Regular Columns`)
        ).toBeInTheDocument();
        expect(screen.getByText(`CMS Row with Columns`)).toBeInTheDocument();
    });

    it('should render with 3 tab options', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });
        expect(screen.getByText(`Custom Row`)).toBeInTheDocument();
        expect(screen.getByText(`Row Symbols`)).toBeInTheDocument();
        expect(screen.getByText(`Saved Rows`)).toBeInTheDocument();
    });

    it('should render elements of nested ROW type', async () => {
        render(<AddSectionModal {...value} editAddress="0.0.0.0" />, {
            wrapper: Wrapper,
        });
        const wrappers = screen.getAllByTestId(/wrapper/);

        expect(screen.getByText(`Custom Row`)).toBeInTheDocument();
        expect(wrappers).toHaveLength(4);
    });
});

describe('Test for COLUMN', () => {
    const value = { ...data, editAddress: '0.0.0', type: 'COLUMN' };
    it('it should add type COLUMN', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });
        expect(screen.getByText(`Add new COLUMN`)).toBeInTheDocument();
    });

    it('should render single contentview comp', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });

        const wrappers = screen.getAllByTestId(/wrapper/);

        expect(wrappers).toHaveLength(1);
        expect(screen.getByText(`Regular Columns`)).toBeInTheDocument();
    });
    it('should render with 3 tab options', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });

        expect(screen.getByText(`Custom Column`)).toBeInTheDocument();
        expect(screen.getByText(`Column Symbols`)).toBeInTheDocument();
        expect(screen.getByText(`Saved Column`)).toBeInTheDocument();
    });
});

describe('Test for ELEMENT', () => {
    const value = { ...data, editAddress: '0.0.0.0', type: 'ELEMENT' };
    it('it should add type ELEMENT', async () => {
        render(<AddSectionModal {...value} />, {
            wrapper: Wrapper,
        });
        expect(screen.getByText(`Add new ELEMENT`)).toBeInTheDocument();
    });

    it('should render 4 contentview comp', async () => {
        render(
            <AddSectionModal {...data} editAddress="0.0.0.0" type="ELEMENT" />,
            {
                wrapper: Wrapper,
            }
        );
        const wrappers = screen.getAllByTestId(/wrapper/);

        expect(wrappers).toHaveLength(4);
        expect(screen.getByText(`Default Elements`)).toBeInTheDocument();
    });

    it('should render 3 contentview comp', async () => {
        render(<AddSectionModal {...value} editAddress="0.0.0.0.0" />, {
            wrapper: Wrapper,
        });
        const wrappers = screen.getAllByTestId(/wrapper/);
        expect(wrappers).toHaveLength(3);
    });
    it('should render with 3 tab options', async () => {
        render(<AddSectionModal {...value} editAddress="0.0.0.0.0" />, {
            wrapper: Wrapper,
        });

        expect(screen.getByText(`Default Elements`)).toBeInTheDocument();
        expect(screen.getByText(`Element Symbols`)).toBeInTheDocument();
        expect(screen.getByText(`Saved Elements`)).toBeInTheDocument();
    });
});
