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

interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryResult {
  word: string;
  phonetics: PhoneticInfo[];
  meanings: Meaning[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

export const DictionaryResult = () => {
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
        throw new Error('Word not found in the dictionary');
      }
      const data: DictionaryResult[] = await response.json();

      const processedData = data.map((entry) => ({
        word: entry.word,
        phonetics: entry.phonetics.filter((phonetic) => phonetic.audio !== ''),
        meanings: entry.meanings.map((meaning) => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.slice(0, 5).map((def) => ({
            definition: def.definition,
            synonyms: def.synonyms,
            antonyms: def.antonyms,
          })),
        })),
        license: entry.license,
        sourceUrls: entry.sourceUrls,
      }));

      setSearchResults(processedData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setSearchResults([]);
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
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          textAlign: 'center',
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
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          maxWidth: '100%',
          height: '500px',
          overflow: 'scroll',
          padding: ' 0 36px 36px',
          borderRadius: '10px',
          background: 'rgba(30, 30, 30, 0.8)',
        }}
      >
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {searchResults.map((result, index) => (
          <div key={index}>
            <h3>{result.word}</h3>
            {result.phonetics.map((phonetic, phoneticIndex) => (
              <div key={phoneticIndex}>
                <p>Phonetic Text: {phonetic.text}</p>
                {phonetic.audio && (
                  <audio controls>
                    <source src={phonetic.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}

            {result.meanings.map((meaning, meaningIndex) => (
              <div key={meaningIndex}>
                <h4>Part of Speech: {meaning.partOfSpeech}</h4>
                {meaning.definitions.map((def, defIndex) => (
                  <div key={defIndex}>
                    {def.definition && <p>Definition: {def.definition}</p>}
                    {def.synonyms && def.synonyms.length > 0 && (
                      <p>Synonyms: {def.synonyms.join(', ')}</p>
                    )}
                    {def.antonyms && def.antonyms.length > 0 && (
                      <p>Antonyms: {def.antonyms.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {result.license?.name && (
              <p>
                License:
                <a
                  href={result.license?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.license.name}
                </a>
              </p>
            )}
            <p>
              Source URLs:
              {result.sourceUrls.map((url, urlIndex) => (
                <a
                  key={urlIndex}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url}
                </a>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
