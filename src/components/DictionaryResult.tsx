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

interface DictionaryResult {
  word: string;
  phonetic: string;
  phonetics: PhoneticInfo[];
}

export const DictionarySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<DictionaryResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
      );
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      setSearchResults(data);
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
            <h3>{result.word}</h3>
            <p>Phonetic: {result.phonetic}</p>
            <div>
              {result.phonetics.map((phonetic, phoneticIndex) => (
                <div key={phoneticIndex}>
                  <p>{phonetic.text}</p>
                  {phonetic.audio && (
                    <audio controls>
                      <source src={phonetic.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {phonetic.sourceUrl && (
                    <a
                      href={phonetic.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source
                    </a>
                  )}
                  {phonetic.license?.name && (
                    <p>
                      License:
                      <a
                        href={phonetic.license?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {phonetic.license.name}
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
