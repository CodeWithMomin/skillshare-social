import api from "./api";

const profileService = {
  getUserProfile: async () => {
    try {
      const response = await api.get("/users/profile");
      return response.data; // your backend wraps user in response.data
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  uploadProfilePhoto: async (file) => {
    // console.log(file);
    
    try {
      const formData = new FormData();
      formData.append("profile", file); // MUST match multer.single("profile")
      for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

      
      const response = await api.post(
        "/users/upload-profile-picture", // MUST include /api
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPLOAD RESPONSE:", response.data);

      return response.data.imageUrl; // Cloudinary URL
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw error.response?.data || error;
    }
  },
};

export default profileService;
