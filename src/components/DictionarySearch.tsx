import React, { useState } from 'react';
import BookBackground from './BookBackground';

interface PhoneticInfo {
  text: string;
  audio: string;
  sourceUrl: string;
  license: {
    name: string;
    url: string;
  };
}

interface Meaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    synonyms: string[];
    antonyms: string[];
    example?: string;
  }[];
}

interface DictionaryResult {
  word: string;
  phonetic: string;
  phonetics: PhoneticInfo[];
  meanings: Meaning[];
}

export const DictionarySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<DictionaryResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setSearchResults([]);
    setError(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
      );
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data: DictionaryResult[] = await response.json();

      if (data.length > 0) {
        const firstResult = data[0];

        const audioPhonetic = firstResult.phonetics.find(
          (phonetic) => phonetic.audio !== ''
        );

        const updatedMeanings = firstResult.meanings.map((meaning) => {
          const firstDefinition = meaning.definitions[0];
          return {
            partOfSpeech: meaning.partOfSpeech,
            definitions: [
              {
                definition: firstDefinition.definition,
                synonyms: firstDefinition.synonyms,
                antonyms: firstDefinition.antonyms,
                example: firstDefinition.example,
              },
            ],
          };
        });

        const updatedResult: DictionaryResult = {
          word: firstResult.word,
          phonetic: firstResult.phonetic,
          phonetics: audioPhonetic ? [audioPhonetic] : [],
          meanings: updatedMeanings,
        };

        setSearchResults([updatedResult]);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderLeftPageContent = () => {
    if (searchResults.length === 0 || searchResults[0].meanings.length === 0)
      return null;

    const result = searchResults[0];
    const firstMeaning = result.meanings[0];

    return (
      <div>
        <h1>{result.word}</h1>
        {result.phonetics.length > 0 && (
          <div>
            <p>Phonetic: {result.phonetics[0].text}</p>
          </div>
        )}
        <p>Part of Speech: {firstMeaning.partOfSpeech}</p>
        {firstMeaning.definitions.map((def, defIndex) => (
          <div key={defIndex}>
            <p>Definition: {def.definition}</p>
            {def.synonyms && def.synonyms.length > 0 && (
              <p>Synonyms: {def.synonyms.join(', ')}</p>
            )}
            {def.antonyms && def.antonyms.length > 0 && (
              <p>Antonyms: {def.antonyms.join(', ')}</p>
            )}
            {def.example && <p>Example: {def.example}</p>}
          </div>
        ))}
      </div>
    );
  };

  const renderRightPageContent = () => {
    if (searchResults.length === 0 || searchResults[0].meanings.length < 2)
      return null;

    const secondMeaning = searchResults[0].meanings[1];
    const result = searchResults[0];

    return (
      <div>
        <p>Part of Speech: {secondMeaning.partOfSpeech}</p>
        {secondMeaning.definitions.map((def, defIndex) => (
          <div key={defIndex}>
            <p>Definition: {def.definition}</p>
            {def.synonyms && def.synonyms.length > 0 && (
              <p>Synonyms: {def.synonyms.join(', ')}</p>
            )}
            {def.antonyms && def.antonyms.length > 0 && (
              <p>Antonyms: {def.antonyms.join(', ')}</p>
            )}
            {def.example && <p>Example: {def.example}</p>}
          </div>
        ))}
        {result.phonetics.length > 0 && (
          <div>
            {result.phonetics[0].audio && (
              <audio controls style={{ width: '100%' }}>
                <source src={result.phonetics[0].audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a word"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {searchResults.length > 0 && (
        <BookBackground
          leftPageContent={renderLeftPageContent()}
          rightPageContent={renderRightPageContent()}
        />
      )}
    </div>
  );
};
