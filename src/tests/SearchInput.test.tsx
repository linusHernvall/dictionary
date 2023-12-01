import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, vi } from 'vitest';
import { SearchInput } from '../components/SearchInput';

describe('SearchInput Component', () => {
  test('renders input and button', () => {
    render(
      <SearchInput searchTerm="" setSearchTerm={() => {}} onSubmit={() => {}} />
    );

    const input = screen.getByPlaceholderText('Search for a word');
    const button = screen.getByText('Search');

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('allows typing in the search input', async () => {
    const setSearchTerm = vi.fn();
    render(
      <SearchInput
        searchTerm=""
        setSearchTerm={setSearchTerm}
        onSubmit={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Search for a word');
    await userEvent.type(input, 'hello');

    expect(setSearchTerm).toHaveBeenCalledTimes(5);
  });

  test('submits the form with the search term', async () => {
    const searchTerm = 'hello';
    const onSubmit = vi.fn();
    render(
      <SearchInput
        searchTerm={searchTerm}
        setSearchTerm={() => {}}
        onSubmit={onSubmit}
      />
    );

    const button = screen.getByText('Search');
    await userEvent.click(button);

    expect(onSubmit).toHaveBeenCalledWith(searchTerm);
  });
});
