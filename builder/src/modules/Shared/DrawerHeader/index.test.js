import DrawerHeader from './';
import { render, screen, userEvent } from '@/util/test-utils.js';
it('should render search input field', () => {
    render(<DrawerHeader title="elements" onChange={function () {}} />);

    const searchInput = screen.getByPlaceholderText('Search');

    expect(searchInput).toBeInTheDocument();
});

it('should render modal title in the document', () => {
    render(<DrawerHeader title="elements" onChange={function () {}} />);

    const modalTitle = screen.getByText('elements');

    expect(modalTitle).toBeInTheDocument();
});

it('should update search state on input change', async () => {
    render(<DrawerHeader title="elements" onChange={function () {}} />);

    const searchInput = screen.getByPlaceholderText('Search');

    await userEvent.type(searchInput, 'example');

    expect(searchInput.value).toBe('example');
});

it('should update search state on search button click', async () => {
    render(<DrawerHeader title="elements" onChange={function () {}} />);

    const searchInput = screen.getByPlaceholderText('Search');

    await userEvent.type(searchInput, 'example');

    const searchButton = screen.getByRole('img');
    await userEvent.click(searchButton);

    expect(searchInput.value).toBe('example');
});
