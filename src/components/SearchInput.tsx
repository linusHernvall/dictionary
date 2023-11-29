interface SearchInput {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  onSubmit: (searchTerm: string) => void;
}

export const SearchInput = ({
  searchTerm,
  setSearchTerm,
  onSubmit,
}: SearchInput) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
          //   height: '40px',
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
