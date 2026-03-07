const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pics",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // auto resize
  },
});

const chatStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_media",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "mp4"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });
const chatUpload = multer({ storage: chatStorage });

module.exports = { upload, chatUpload };
