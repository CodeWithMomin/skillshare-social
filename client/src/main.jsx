import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { EduContextProvider } from './context/EducationContext.jsx';
import { ExpContextProvider } from './context/ExpContext.jsx';


createRoot(document.getElementById('root')).render(
 
    <AuthProvider>
      <ExpContextProvider>
        <EduContextProvider>
        <App />
      </EduContextProvider>
      </ExpContextProvider>
    </AuthProvider>
 
);
