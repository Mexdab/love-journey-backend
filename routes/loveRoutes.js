const express = require("express");
const router = express.Router();

const {
    createLovePage,
    getLovePageBySlug,
    uploadImages
} = require("../controllers/loveController");

const upload = require("../config/multer"); // Ensure this path is correct


// ✅ Upload photos to Cloudinary
router.post(
    "/upload-images",
    upload.array("photos", 10),
    uploadImages
);

// ✅ FIX: Change "/create" to "/create-page" to match Frontend
router.post("/create-page", createLovePage);

// ✅ Get love page by SLUG (shareable link)
router.get("/:slug", getLovePageBySlug);

module.exports = router;