import React, { createContext, useContext, useState, useEffect } from "react";
import postService from "../services/postService";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(false);

  // ===========================
  // 🟦 FETCH FEED
  // ===========================
  const loadFeed = async () => {
    try {
      setLoadingFeed(true);
      const data = await postService.getFeed();
      setPosts(data); // data is array of posts
    } catch (error) {
      toast.error(error || "Failed to load feed");
    } finally {
      setLoadingFeed(false);
    }
  };

  // Auto-load feed on login
  useEffect(() => {
    if (isAuthenticated) loadFeed();
  }, [isAuthenticated]);

  // ===========================
  // 🟩 CREATE POST (multiple images)
  // ===========================
  const createPost = async (caption, images) => {
    try {
      const result = await postService.createPost(caption, images);

      if (result.success) {
        setPosts((prev) => [result.post, ...prev]); // prepend new post
        toast.success("Post uploaded!");
      }

      return result;
    } catch (error) {
      toast.error(error || "Failed to upload post");
    }
  };

  // ===========================
  // ❤️ LIKE POST
  // ===========================
  const likePost = async (postId) => {
    try {
      const result = await postService.likePost(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: [...p.likes, "tempUser"] } : p
        )
      );

      return result;
    } catch (error) {
      toast.error(error);
    }
  };

  // ===========================
  // 💔 UNLIKE POST
  // ===========================
  const unlikePost = async (postId) => {
    try {
      const result = await postService.unlikePost(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: p.likes.filter((id) => id !== "tempUser") }
            : p
        )
      );

      return result;
    } catch (error) {
      toast.error(error);
    }
  };

  // ===========================
  // 💬 ADD COMMENT
  // ===========================
  const addComment = async (postId, text) => {
    try {
      const result = await postService.addComment(postId, text);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: result.comments } : p
        )
      );

      return result;
    } catch (error) {
      toast.error(error);
    }
  };

  // ===========================
  // 🗑 DELETE COMMENT
  // ===========================
  const deleteComment = async (postId, commentId) => {
    try {
      const result = await postService.deleteComment(postId, commentId);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: result.comments } : p
        )
      );

      toast.success("Comment removed");
    } catch (error) {
      toast.error(error);
    }
  };

  // ===========================
  // 🗑 DELETE POST
  // ===========================
  const deletePost = async (postId) => {
    try {
      const result = await postService.deletePost(postId);

      if (result.success) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        toast.success("Post deleted");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loadingFeed,
        loadFeed,
        createPost,
        likePost,
        unlikePost,
        addComment,
        deleteComment,
        deletePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
