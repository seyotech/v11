import { render, screen, userEvent, waitFor } from '@/util/test-utils';
import PageNameSlug from './PageNameSlug';
import { specialChars } from './__mocks__/testCharacters';

const initialProps = {
    close: vi.fn(),
    page: {
        name: 'About',
        slug: 'about',
        pageIndex: 0,
        pageType: 'REGULAR',
        id: '1',
    },
};

const mockTranslation = vi.fn((text) => text);

vi.mock('react-i18next', () => ({
    ...vi.importActual('react-i18next'),
    useTranslation: () => {
        return {
            t: mockTranslation,
        };
    },
}));

describe('Change Page Slug', () => {
    // Test that the form is rendered with the correct label and input
    it('should render form with correct label and input', () => {
        render(<PageNameSlug {...initialProps} />);
        expect(screen.getByLabelText(/Page Slug/i)).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/Enter Page Slug/i)
        ).toBeInTheDocument();
    });

    // Test that the handleSubmit function is called when the form is submitted.
    it('should change value when user inputs characters', async () => {
        render(<PageNameSlug {...initialProps} />);
        const input = screen.getByPlaceholderText(/Enter Page Slug/i);
        await userEvent.clear(input);
        await userEvent.type(input, 'new-slug');
        expect(input.value).toBe('new-slug');
    });

    // Test that an error message is displayed when the slug starts with a non-alphanumeric character.
    it.each(specialChars)(
        'should display error message when slug starts with %s',
        async (char) => {
            render(<PageNameSlug {...initialProps} />);
            const input = screen.getByPlaceholderText(/Enter Page Slug/i);
            await userEvent.clear(input);
            await userEvent.type(input, `${char}slug`);
            expect(
                await screen.findByText(
                    /Must start with alphanumeric character/i
                )
            ).toBeInTheDocument();
        }
    );

    // Test that an error message is displayed when the slug ends with a non-alphanumeric character.
    it.each(specialChars)(
        'should display error message when slug ends with %s',
        async (char) => {
            render(<PageNameSlug {...initialProps} />);
            const input = screen.getByPlaceholderText(/Enter Page Slug/i);
            await userEvent.type(input, `slug${char}`);
            expect(
                await screen.findByText(/Must end with alphanumeric character/i)
            ).toBeInTheDocument();
        }
    );

    // Test that an error message is displayed when the slug contains special characters other than hyphen and underscore.
    it.each(specialChars)(
        'Should display error message when slug contains special character %s',
        async (char) => {
            render(<PageNameSlug {...initialProps} />);
            const input = screen.getByPlaceholderText(/Enter Page Slug/i);
            await userEvent.type(input, `new${char}slug`);
            expect(mockTranslation).toHaveBeenCalledWith(
                'Allowed special characters are',
                {
                    chars: ': - and _',
                }
            );
        }
    );
});

// Test that an error message is displayed when the slug field contains invalid characters.
it('should display error message when slug field contains invalid characters', async () => {
    render(<PageNameSlug {...initialProps} />);
    const input = screen.getByPlaceholderText(/Enter Page Slug/i);
    await userEvent.type(input, 'invalid;slug');
    // expect(
    //     await screen.findByText(/Allowed special characters are - and _/i)
    // ).toBeInTheDocument();
    expect(mockTranslation).toHaveBeenCalledWith(
        'Allowed special characters are',
        {
            chars: ': - and _',
        }
    );
});

describe('submitHandler test', async () => {
    // Mocking the useContext value
    const mockPages = [
        {
            name: 'About',
            slug: 'about',
            pageType: 'REGULAR',
        },
        {
            name: 'En',
            slug: 'about/en',
            pageType: 'REGULAR',
        },
        {
            name: 'Oxford',
            slug: 'about/en/oxford',
            pageType: 'REGULAR',
        },
        {
            name: 'version1',
            slug: 'about/en/oxford/version1',
            pageType: 'REGULAR',
        },
        {
            name: 'version1.1',
            slug: 'about/en/oxford/version1/version1-1',
            pageType: 'REGULAR',
        },
    ];

    const mockSave = vi.fn();

    const initialContextValues = {
        pages: mockPages,
        save: mockSave,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it(`should form work expectedly for a page which multi level nested pages`, async () => {
        const handleContextMenu = vi.fn();
        render(<PageNameSlug {...initialProps} />, {
            shortContext: {
                ...initialContextValues,
                save: mockSave,
            },
        });
        //testing the initial modal visual
        expect(screen.getByRole('textbox', { name: /page name/i }).value).toBe(
            'About'
        );
        expect(screen.getByRole('textbox', { name: /page slug/i }).value).toBe(
            'about'
        );
        //testing for only name change
        await userEvent.clear(
            screen.getByRole('textbox', { name: /page name/i })
        );
        await userEvent.type(
            screen.getByRole('textbox', { name: /page name/i }),
            'Details page'
        );
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(mockSave).toHaveBeenCalledWith(
            {
                pages: [
                    {
                        name: 'Details page',
                        slug: 'about',
                        pageType: 'REGULAR',
                        data: undefined,
                    },
                ],
            },
            { isNotify: true }
        );
        // testing for  slug change
        await userEvent.clear(
            screen.getByRole('textbox', { name: /page slug/i })
        );
        await userEvent.type(
            screen.getByRole('textbox', { name: /page slug/i }),
            'dictionary'
        );
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(mockSave).toHaveBeenCalledWith(
            {
                pages: [
                    {
                        name: 'Details page',
                        slug: 'dictionary',
                        pageType: 'REGULAR',
                        data: undefined,
                    },
                    {
                        name: 'En',
                        slug: 'dictionary/en',
                        pageType: 'REGULAR',
                        data: undefined,
                    },
                    {
                        name: 'Oxford',
                        slug: 'dictionary/en/oxford',
                        pageType: 'REGULAR',
                        data: undefined,
                    },
                    {
                        name: 'version1',
                        slug: 'dictionary/en/oxford/version1',
                        pageType: 'REGULAR',
                        data: undefined,
                    },
                    {
                        name: 'version1.1',
                        slug: 'dictionary/en/oxford/version1/version1-1',
                        pageType: 'REGULAR',
                        data: undefined,
                    },
                ],
            },
            { isNotify: true }
        );
    });
});

describe('Change Page Name', () => {
    // Test that the form is rendered with the correct label and input
    it('should render form with correct label and input', () => {
        render(<PageNameSlug {...initialProps} />);
        expect(screen.getByLabelText(/Page Name/i)).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/Enter Page Name/i)
        ).toBeInTheDocument();
    });

    // Test that the handleSubmit function is called when the form is submitted.
    it('should change value when user inputs characters', async () => {
        render(<PageNameSlug {...initialProps} />);
        const input = screen.getByPlaceholderText(/Enter Page Name/i);
        await userEvent.clear(input);
        await userEvent.type(input, 'new-name');
        expect(input.value).toBe('new-name');
        // waitFor(() => {
        //     expect(input.value).toBe('new-name');
        // });
    });
});
