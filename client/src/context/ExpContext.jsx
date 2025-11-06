import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import expService from "../services/expService";

const ExperienceContext = createContext();

export const ExpContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [experiences, setExperiences] = useState([]);

  // 🔹 Fetch all experiences
  const getExperience = async () => {
    if (isAuthenticated && user?._id) {
      const result = await expService.getExperience(user._id);
      if (result?.success) {
        setExperiences(result.data);
      }
      return result;
    }
  };

  // 🔹 Add new experience
  const addExperience = async (experienceData) => {
    if (isAuthenticated && user?._id) {
      const result = await expService.addExperience(user._id, experienceData);
      if (result?.success) {
        setExperiences((prev) => [...prev, result.data]);
      }
      return result;
    }
  };

  // 🔹 Delete experience (optional)
  const deleteExperience = async (expId) => {
    if (isAuthenticated && user?._id) {
      const result = await expService.deleteExperience(user._id, expId);
      if (result?.success) {
        setExperiences((prev) => prev.filter((e) => e._id !== expId));
      }
      return result;
    }
  };
  const updateExperience = async (expId, experienceData) => {
  if (isAuthenticated && user?._id) {
    try {
      const result = await expService.updateExperience(user._id, expId, experienceData);

      // Optional: update state locally if you keep experiences in context
      setExperiences((prev) =>
        prev.map((exp) =>
          exp._id === expId ? { ...exp, ...result.data } : exp
        )
      );

      return result;
    } catch (error) {
      console.error("Error updating experience:", error);
      throw error;
    }
  }
};

  // ✅ Provide data and functions globally
  return (
    <ExperienceContext.Provider
      value={{
        experiences,
        getExperience,
        addExperience,
        deleteExperience,
        updateExperience
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

// ✅ Hook to use in components
export const useExp = () => useContext(ExperienceContext);

