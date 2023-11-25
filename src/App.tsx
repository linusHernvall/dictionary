import { DictionarySearch } from './components/DictionarySearch';

function App() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        border: '1px solid salmon',
      }}
    >
      <DictionarySearch />
    </div>
  );
}

export default App;
