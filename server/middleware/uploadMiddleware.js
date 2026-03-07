const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pics",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const chatStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Determine resource type based on mimetype
    let resourceType = "auto";
    let folder = "chat_media";

    if (file.mimetype.startsWith("video/")) {
      folder = "chat_videos";
    } else if (
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("msword") ||
      file.mimetype.includes("officedocument") ||
      file.mimetype.includes("spreadsheet") ||
      file.mimetype.includes("presentation")
    ) {
      folder = "chat_docs";
      resourceType = "raw"; // Cloudinary stores docs as raw files
    }

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: [
        // Images
        "jpg", "jpeg", "png", "gif", "webp",
        // Videos
        "mp4", "mov", "avi", "mkv", "webm",
        // Documents
        "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt",
      ],
    };
  },
});

const upload = multer({ storage });
const chatUpload = multer({
  storage: chatStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});

module.exports = { upload, chatUpload };
