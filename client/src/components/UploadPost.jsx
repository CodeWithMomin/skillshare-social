import React, { useState } from "react";
import "../App.css"; // You can place CSS below in App.css

const UploadPost = () => {
  const [postText, setPostText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postText && !file) {
      alert("Write something or upload a file before posting!");
      return;
    }

    const newPost = {
      id: Date.now(),
      text: postText,
      image: preview,
      date: new Date().toLocaleString(),
    };

    // Simulate saving post
    setPosts([newPost, ...posts]);
        console.log(newPost)
    // Reset form
    setPostText("");
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="upload-post-container">
      <div className="upload-box">
        <h3>Create a Post</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Share your thoughts or project updates..."
          />
          {preview && (
            <div className="preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
          <div className="upload-actions">
            <label className="file-label">
              📷 Upload Image
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            <button type="submit">Post</button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default UploadPost;
