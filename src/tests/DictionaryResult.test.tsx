import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect } from 'vitest';
import { DictionaryResult } from '../components/DictionaryResult';

describe('Loading- and error message', () => {
  test('show loading message when searching for a word', async () => {
    render(<DictionaryResult />);

    const searchWord = screen.getByPlaceholderText('Search for a word');
    const searchButton = screen.getByText('Search');

    await userEvent.type(searchWord, 'word');
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

describe('phonetics audio', () => {
  test('the audio player is rendered', async () => {
    render(<DictionaryResult />);

    const searchWord = screen.getByPlaceholderText('Search for a word');
    const searchButton = screen.getByText('Search');

    await userEvent.type(searchWord, 'chef');
    await userEvent.click(searchButton);

    await waitFor(() => {
      const audioPlayer = document.querySelector('audio');
      expect(audioPlayer).toBeInTheDocument();
    });
  });
});

describe('render result', () => {
  test.only('check for search result of searched word', async () => {
    render(<DictionaryResult />);

    const searchWord = screen.getByPlaceholderText('Search for a word');
    const searchButton = screen.getByText('Search');

    await userEvent.type(searchWord, 'father');
    await userEvent.click(searchButton);

    const phoneticText = await screen.findAllByText(/Phonetic Text:/);
    expect(phoneticText).toHaveLength(2);

    const partOfSpeech = await screen.findAllByText(/Part of Speech:/);
    expect(partOfSpeech).toHaveLength(2);

    const definition = await screen.findAllByText(/Definition:/);
    expect(definition).toHaveLength(10);

    const example = await screen.findAllByText(/Example:/);
    expect(example).toHaveLength(3);

    const synonyms = await screen.findByText(/Synonyms:/);
    expect(synonyms).toBeInTheDocument();

    const antonyms = await screen.findByText(/Antonyms:/);
    expect(antonyms).toBeInTheDocument();

    const license = await screen.findByText(/License:/);
    expect(license).toBeInTheDocument();

    const sourceUrl = await screen.findByText(/Source URLs:/);
    expect(sourceUrl).toBeInTheDocument();
  });
});
