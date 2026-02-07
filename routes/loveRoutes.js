const express = require("express");
const router = express.Router();

const {
    createLovePage,
    getLovePageBySlug,
    uploadImages
} = require("../controllers/loveController");

const upload = require("../config/multer");


// ✅ Upload photos to Cloudinary
router.post(
    "/upload-images",
    upload.array("photos", 10),
    uploadImages
);

// ✅ Create love page
router.post("/create", createLovePage);

// ✅ Get love page by SLUG (shareable link)
router.get("/:slug", getLovePageBySlug);

module.exports = router;
