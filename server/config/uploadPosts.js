const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "post_images",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

module.exports = multer({ storage });
