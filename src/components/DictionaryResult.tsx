import { useState } from 'react';
import { SearchInput } from './SearchInput';

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
  example: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
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

  const handleSearch = async (searchTerm: string) => {
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
            example: def.example,
          })),
          synonyms: meaning.synonyms,
          antonyms: meaning.antonyms,
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
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmit={handleSearch}
        />
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

        {/* Word */}
        {searchResults.map((result, index) => (
          <div key={index}>
            <h1>{result.word}</h1>

            {/*  Phonetics */}
            {result.phonetics.map((phonetic, phoneticIndex) => (
              <div key={phoneticIndex}>
                <h4>Phonetic Text: {phonetic.text}</h4>
                {phonetic.audio && (
                  <audio controls>
                    <source src={phonetic.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}

            {/* Meanings  */}
            {result.meanings.map((meaning, meaningIndex) => (
              <div key={meaningIndex}>
                <h4>Part of Speech: {meaning.partOfSpeech}</h4>
                {meaning.definitions.map((def, defIndex) => (
                  <div key={defIndex}>
                    {def.definition && (
                      <p>
                        <b>Definition: </b>
                        {def.definition}
                      </p>
                    )}
                    {def.example && (
                      <p>
                        <b>Example: </b>
                        {def.example}
                      </p>
                    )}
                  </div>
                ))}
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <p>
                    <b>Synonyms: </b>
                    {meaning.synonyms.join(', ')}
                  </p>
                )}
                {meaning.antonyms && meaning.antonyms.length > 0 && (
                  <p>
                    <b>Antonyms: </b>
                    {meaning.antonyms.join(', ')}
                  </p>
                )}
              </div>
            ))}

            {/* License */}
            {result.license?.name && (
              <p>
                <b>License: </b>
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
              <b>Source URLs: </b>
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
