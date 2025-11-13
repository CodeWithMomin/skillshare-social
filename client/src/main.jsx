// ...existing code...
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // add this import
import { EduContextProvider } from './context/EducationContext.jsx';
import { ExpContextProvider } from './context/ExpContext.jsx';
import { InternshipContextProvider } from './context/InternshipContext.jsx';
// ...existing code...

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <EduContextProvider>
         <ExpContextProvider>
          <InternshipContextProvider>
            <App />
          </InternshipContextProvider>
         </ExpContextProvider>
      </EduContextProvider>
     
    </AuthProvider>
  </StrictMode>
);
// ...existing code...