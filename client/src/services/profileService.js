import api from './api';

const profileService = {

  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.user;  // Adjust if API response differs
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  uploadProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post('/users/upload-profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.imageUrl;  // Adjust to actual response field
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }
};

export default profileService;
