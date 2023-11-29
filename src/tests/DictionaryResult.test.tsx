import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect } from 'vitest';
import { DictionaryResult } from '../components/DictionaryResult';

describe('Searching and loading', () => {
  test('show loading message when searching for a word', async () => {
    render(<DictionaryResult />);

    const searchedWord = screen.getByPlaceholderText('Search for a word');
    const searchButton = screen.getByText('Search');

    await userEvent.type(searchedWord, 'word');
    await userEvent.click(searchButton);

    await waitFor(() => {
      const loadingMessage = screen.queryByText('Loading...');
      expect(loadingMessage).toBeInTheDocument();
    });
  });

  test('show an error message when searching with a blank input', async () => {
    render(<DictionaryResult />);

    const searchButton = screen.getByText('Search');

    await userEvent.click(searchButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText(
        'Word not found in the dictionary'
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
