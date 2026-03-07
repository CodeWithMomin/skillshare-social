// ...existing code...

import React, { StrictMode } from 'react';
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
import { AlumniAuthContextProvider } from './AlumniConnect/alumniContext/AlumniAuthContext.jsx'
import { AlumniSkillContextProvider } from './AlumniConnect/alumniContext/AlumniSKillcontext.jsx';
import { AlumniLanguageContextProvider } from './AlumniConnect/alumniContext/AlumniLanguageContext.jsx';
import { AlumniAcheivementContextProvider } from './AlumniConnect/alumniContext/AlumniAcheivement.jsx';
import { AlumniAcademicContextProvider } from './AlumniConnect/alumniContext/AlumniAcademicContext.jsx';
import { AlumniInfoContextProvider } from './AlumniConnect/alumniContext/AlumniInfoContext.jsx';
import { AlumniBasicInfoContextProvider } from './AlumniConnect/alumniContext/AlumniBasicINfoContext.jsx';

createRoot(document.getElementById('root')).render(

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
                      <AlumniSkillContextProvider>
                        <AlumniLanguageContextProvider>
                          <AlumniAcheivementContextProvider>
                            <AlumniAcademicContextProvider>
                              <AlumniBasicInfoContextProvider>
                                <AlumniInfoContextProvider>
                                  <App />
                                </AlumniInfoContextProvider>
                              </AlumniBasicInfoContextProvider>
                            </AlumniAcademicContextProvider>
                          </AlumniAcheivementContextProvider>
                        </AlumniLanguageContextProvider>
                      </AlumniSkillContextProvider>

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

);
// ...existing code...