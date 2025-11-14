import api from "./api";

const internshipService = {
  // ➕ Add Internship
  addInternships: async (userId, internshipData) => {
    try {
      const response = await api.post(`/users/${userId}/internships`, internshipData);
      return { 
        success: true, 
        data: response?.data?.internships || response?.internships // ✅ Safe c
      };
    } catch (error) {
      return { 
        success: false,
        error: error.message || "Failed to add Internship Information.",
      };
    }
  },

  // ✏️ Update Internship
  updateInternships: async (internshipId, internshipData) => {
    try {
      const response = await api.put(`/users/internships/${internshipId}`, internshipData);
      return { 
        success: true, 
        data: response.internships 
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to Update Internship Information.",
      };
    }
  },

  // ❌ Delete Internship
  deleteInternships: async (userId, internshipId) => {
    try {
      const response = await api.delete(`/users/${userId}/internships/${internshipId}`);
      return { 
        success: true, 
        data: response?.data?.internships || response?.internships // ✅ Safe check
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to delete Internship Information.",
      };
    }
  },
};

export default internshipService;
