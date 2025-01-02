import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { FirebaseProvider } from './providers/FirebaseProvider';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
    <FirebaseProvider>
      <Toaster position="top-center" />
      <App />
    </FirebaseProvider>
);