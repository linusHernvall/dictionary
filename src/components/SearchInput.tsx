interface SearchInput {
  searchWord: string;
  setSearchWord: (searchWord: string) => void;
  onSubmit: (searchWord: string) => void;
}

export const SearchInput = ({
  searchWord,
  setSearchWord,
  onSubmit,
}: SearchInput) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(searchWord);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        placeholder="Search for a word"
        style={{
          padding: '8px 12px',
          width: '400px',
          borderRadius: '10px 0 0 10px',
          background: 'rgba(217, 217, 217, 0.80)',
          border: 'none',
          color: '#323F3F',
        }}
      />
      <button
        style={{
          width: '80px',
          padding: '8px 12px',
          borderRadius: '0 10px 10px 0',
          background: '#323F3F',
          fontFamily: 'inherit',
          border: 'none',
        }}
        type="submit"
      >
        Search
      </button>
    </form>
  );
};
