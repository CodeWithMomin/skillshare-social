import { React, createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import profileService from '../services/profileService';

const ProfilePictureContext = createContext();

export const ProfilePictureContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profilePic, setProfilePic] = useState('');

  const uploadProfilePicture = async (file) => {
    try {
      if (!isAuthenticated || !user?._id) return;

      const url = await profileService.uploadProfilePhoto(file);

      if (url) {
        setProfilePic(url);   // update context state
      }

      return { success: true, url };

    } catch (error) {
      console.error('Upload Profile Picture Error:', error);
      return { success: false, error };
    }
  };

  return (
    <ProfilePictureContext.Provider
      value={{
        profilePic,
        uploadProfilePicture,
      }}
    >
      {children}
    </ProfilePictureContext.Provider>
  );
};

export const useProfilePicture = () => useContext(ProfilePictureContext);
