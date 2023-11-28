import { BackgroundImage } from './components/BackgroundImage';
import { DictionaryResult } from './components/DictionaryResult';

function App() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <BackgroundImage />
      <DictionaryResult />
    </div>
  );
}

export default App;
