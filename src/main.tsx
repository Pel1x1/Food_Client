import { createRoot } from 'react-dom/client';
import './app/globals.scss';
import './shared/styles/theme.scss';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(<App />);
