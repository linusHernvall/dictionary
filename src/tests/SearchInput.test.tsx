import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, vi } from 'vitest';
import { SearchInput } from '../components/SearchInput';

describe('SearchInput Component', () => {
  test('renders input and button', () => {
    render(
      <SearchInput searchWord="" setSearchWord={() => {}} onSubmit={() => {}} />
    );

    const input = screen.getByPlaceholderText('Search for a word');
    const button = screen.getByText('Search');

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('allows typing in the search input', async () => {
    const setSearchWord = vi.fn();
    render(
      <SearchInput
        searchWord=""
        setSearchWord={setSearchWord}
        onSubmit={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Search for a word');
    await userEvent.type(input, 'hello');

    expect(setSearchWord).toHaveBeenCalledTimes(5);
  });

  test('submits the form with the searched word', async () => {
    const searchWord = 'hello';
    const onSubmit = vi.fn();
    render(
      <SearchInput
        searchWord={searchWord}
        setSearchWord={() => {}}
        onSubmit={onSubmit}
      />
    );

    const button = screen.getByText('Search');
    await userEvent.click(button);

    expect(onSubmit).toHaveBeenCalledWith(searchWord);
  });
});
