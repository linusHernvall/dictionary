import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect } from 'vitest';
import { DictionaryResult } from '../components/DictionaryResult';

describe('Loading- and error message', () => {
  test('show loading message when searching for a word', async () => {
    render(<DictionaryResult />);

    const searchWord = screen.getByPlaceholderText('Search for a word');
    const searchButton = await screen.findByText('Search');

    await userEvent.type(searchWord, 'word');
    userEvent.click(searchButton);

    await waitFor(() => {
      const loadingMessage = screen.queryByText('Loading...');
      expect(loadingMessage).toBeInTheDocument();
    });
  });

  test('show an error message when searching with a blank input using the enter-key', async () => {
    render(<DictionaryResult />);

    const searchBar = screen.getByPlaceholderText('Search for a word');
    await userEvent.type(searchBar, '{enter}');

    const errorMessage = await screen.findByText(
      'Word not found in the dictionary'
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test('word not found', async () => {
    render(<DictionaryResult />);

    const searchWord = await screen.getByPlaceholderText('Search for a word');
    const searchButton = await screen.findByText('Search');

    userEvent.type(searchWord, 'hejsan');
    userEvent.click(searchButton);

    const wordNotFound = await screen.findByText(
      'Word not found in the dictionary'
    );
    expect(wordNotFound).toBeInTheDocument();
  });
});

describe('phonetics audio', () => {
  test('the audio player is rendered', async () => {
    render(<DictionaryResult />);

    const searchWord = screen.getByPlaceholderText('Search for a word');
    const searchButton = await screen.findByText('Search');

    await userEvent.type(searchWord, 'chef');
    await userEvent.click(searchButton);

    await waitFor(() => {
      const audioPlayer = screen.getByRole('audio');
      expect(audioPlayer).toBeInTheDocument();
      expect(audioPlayer).toHaveAttribute(
        'src',
        'https://api.dictionaryapi.dev/media/pronunciations/en/chef-au.mp3'
      );
    });
  });
});

describe('render result', () => {
  test('check for search result of searched word', async () => {
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
