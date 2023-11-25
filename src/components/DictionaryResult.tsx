import React, { useState } from 'react';

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

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search for a word"
      />
      <button onClick={handleSearch}>Search</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        {searchResults.map((result, index) => (
          <div key={index}>
            <h1>{result.word}</h1>
            <p>Phonetic: {result.phonetic}</p>
            {result.phonetics.length > 0 && (
              <div>
                <p>{result.phonetics[0].text}</p>
                {result.phonetics[0].audio && (
                  <audio controls>
                    <source src={result.phonetics[0].audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {result.phonetics[0].license?.name && (
                  <p>
                    License:
                    <a
                      href={result.phonetics[0].license?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.phonetics[0].license.name}
                    </a>
                  </p>
                )}
              </div>
            )}
            {result.meanings.map((meaning, meaningIndex) => (
              <div key={meaningIndex}>
                <p>Part of Speech: {meaning.partOfSpeech}</p>
                {meaning.definitions.map((def, defIndex) => (
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
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
