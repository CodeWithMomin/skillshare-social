// ...existing code...
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // add this import
import { EduContextProvider } from './context/EducationContext.jsx';
import { ExpContextProvider } from './context/ExpContext.jsx';
import { InternshipContextProvider } from './context/InternshipContext.jsx';
import { LanguageContextProvider } from './context/LangContext.jsx';
import { SkillContextProvider } from './context/SkillsContext.jsx';
import { BasicInfoContextProvider } from './context/BasicInfoContext.jsx';
import { CurrentPositionContextProvider } from './context/CurrentPosContext.jsx';
import { ProfilePictureContextProvider } from './context/ProfilePictureContext.jsx';
import {AlumniAuthContextProvider} from './AlumniConnect/alumniContext/AlumniAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <EduContextProvider>
         <ExpContextProvider>
          <InternshipContextProvider>
            <LanguageContextProvider>
            <SkillContextProvider>
               <BasicInfoContextProvider>
                <CurrentPositionContextProvider>
                  <ProfilePictureContextProvider>
                   <AlumniAuthContextProvider>
                      <App />
                   </AlumniAuthContextProvider>
                  </ProfilePictureContextProvider>
                </CurrentPositionContextProvider>
               </BasicInfoContextProvider>
            </SkillContextProvider>
            </LanguageContextProvider>
          </InternshipContextProvider>
         </ExpContextProvider>
      </EduContextProvider>
     
    </AuthProvider>
  </StrictMode>
);
// ...existing code...