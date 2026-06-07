import React from 'react';
import { VocabularyApp } from './components/VocabularyApp';
import wordsData from './data/words.json';
import './index.css';

function App() {
  return (
    <div className="App">
      <VocabularyApp words={wordsData} />
    </div>
  );
}

export default App;
