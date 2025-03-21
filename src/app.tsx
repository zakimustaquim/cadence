import { createRoot } from 'react-dom/client';
import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Hello from React!</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const root = createRoot(document.body);
// root.render(<h2>Hello from React!</h2>);
root.render(<App />);