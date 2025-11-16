// src/services/postService.js
import api from "./api";

const postService = {
  // CREATE POST (Multiple Images)
  createPost: async (caption, images) => {
    try {
      const formData = new FormData();

      // add caption
      formData.append("caption", caption);

      // add multiple images
      images.forEach((img) => {
        formData.append("images", img); // MUST match backend uploadPosts.array("images")
      });

      const response = await api.post("/posts", formData);
      return response; // { success, post }

    } catch (error) {
      console.error("Create Post Error:", error);
      throw error?.message || "Failed to create post";
    }
  },

  // GET FEED
  getFeed: async () => {
    try {
      const response = await api.get("/posts");
      return response.posts; // backend returns: {success, posts}
    } catch (error) {
      console.error("Feed Error:", error);
      throw error?.message || "Failed to load feed";
    }
  },

  // LIKE POST
  likePost: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response; // {success, likes}
    } catch (error) {
      console.error("Like Post Error:", error);
      throw error?.message || "Failed to like post";
    }
  },

  // UNLIKE POST
  unlikePost: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/unlike`);
      return response; // {success, likes}
    } catch (error) {
      console.error("Unlike Post Error:", error);
      throw error?.message || "Failed to unlike post";
    }
  },

  // ADD COMMENT
  addComment: async (postId, text) => {
    try {
      const response = await api.post(`/posts/${postId}/comment`, { text });
      return response; // {success, comments}
    } catch (error) {
      console.error("Add Comment Error:", error);
      throw error?.message || "Failed to add comment";
    }
  },

  // DELETE COMMENT
  deleteComment: async (postId, commentId) => {
    try {
      const response = await api.delete(`/posts/${postId}/comment/${commentId}`);
      return response; // {success, comments}
    } catch (error) {
      console.error("Delete Comment Error:", error);
      throw error?.message || "Failed to delete comment";
    }
  },

  // DELETE POST
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response; // {success, message}
    } catch (error) {
      console.error("Delete Post Error:", error);
      throw error?.message || "Failed to delete post";
    }
  },
};

export default postService;
