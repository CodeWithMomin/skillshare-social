import api from './api';

const profileService = {
  uploadProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profile', file); // MUST match Multer upload.single('profile')

      const response = await api.post(
        '/users/upload-profile-picture',
        formData
      );

      return response.url; // Cloudinary URL returned from backend
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error.response?.data?.message || 'Upload failed';
    }
  },
};

export default profileService;
