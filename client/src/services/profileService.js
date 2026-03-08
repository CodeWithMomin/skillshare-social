import api from "./api";

const profileService = {
  getUserProfile: async () => {
    try {
      const response = await api.get("/users/profile");
      // api interceptor already unwraps response.data
      return response.user || response;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  uploadProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append("profile", file); // MUST match multer.single("profile")

      const response = await api.post(
        "/users/upload-profile-picture", // MUST include /api
        formData
      );

      console.log("UPLOAD RESPONSE:", response);

      // response is already unwrapped by api interceptor
      return response.imageUrl; // Cloudinary URL
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw error.response?.data || error;
    }
  },
};

export default profileService;
