import React, { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'
import internshipService from '../services/internshipService'

const InternshipContext = createContext();

export const InternshipContextProvider = ({ children }) => {

    const { user, isAuthenticated } = useAuth();
    const [userInternships, setUserInternships] = useState([]);

    const addInternships = async (internshipData) => {
        try {
            if (!isAuthenticated || !user?._id) return;

            const result = await internshipService.addInternships(user._id, internshipData);

            if (result.success) {
                // OPTIONAL: update local state
                // setUserInternships(prev => [...prev, result.data]);
            }

            return result;
        } catch (error) {
            console.error("Add Internship Error:", error);
        }
    };

    const deleteInternships = async (internshipId) => {
        try {
            if (!isAuthenticated || !user?._id) return;

            const result = await internshipService.deleteInternships(user._id, internshipId);
            return result;

        } catch (error) {
            console.error("Delete Internship Error:", error);
        }
    };

    const updateInternships = async (internshipId, internshipData) => {
        try {
            if (!isAuthenticated || !user?._id) return;

            const result = await internshipService.updateInternships(internshipId, internshipData);
            return result;

        } catch (error) {
            console.error("Update Internship Error:", error);
        }
    };

    return (
        <InternshipContext.Provider value={{
            userInternships,
            addInternships,
            deleteInternships,
            updateInternships
        }}>
            {children}
        </InternshipContext.Provider>
    );
};

export const useInternship = () => useContext(InternshipContext);
