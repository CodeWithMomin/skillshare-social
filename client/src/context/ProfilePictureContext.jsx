import { React, createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import profileService from "../services/profileService";

const ProfilePictureContext = createContext();

export const ProfilePictureContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profilePic, setProfilePic] = useState("");

  const uploadProfilePicture = async (file) => {
    try {
      if (!isAuthenticated || !user?._id) {
        return { success: false, message: "User not authenticated" };
      }

      // This returns Cloudinary URL (string)
      const imageUrl = await profileService.uploadProfilePhoto(file);

      console.log("Cloudinary URL Received:", imageUrl);

      if (imageUrl) {
        setProfilePic(imageUrl);  // update context state

        return {
          success: true,
          imageUrl,
        };
      }

      return { success: false, message: "Upload failed" };

    } catch (error) {
      console.error("Upload Profile Picture Error:", error);
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
