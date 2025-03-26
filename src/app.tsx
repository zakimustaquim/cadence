import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import './components/AudioRecorder';
import AudioRecorder from './components/AudioRecorder';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <AudioRecorder />
    </div>
  );
};

const root = createRoot(document.body);
// root.render(<h2>Hello from React!</h2>);
root.render(<App />);
