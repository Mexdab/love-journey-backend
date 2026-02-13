const mongoose = require("mongoose");
const LovePage = require("../models/LovePage");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { nanoid } = require("nanoid");

// 1️⃣ UPLOAD IMAGES TO CLOUDINARY
exports.uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No files uploaded" });
        }

        const uploadToCloudinary = (buffer) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "valentine" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(buffer).pipe(uploadStream);
            });
        };

        const uploadedImages = [];
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer);
            uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id
            });
        }

        res.json({ success: true, photos: uploadedImages });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2️⃣ CREATE FREE LOVE PAGE
exports.createLovePage = async (req, res) => {
    try {
        // Use spread operator to catch all dynamic fields (feelingsStart, memoryText, etc.)
        const pageData = req.body;

        // Generate unique slug
        let slug;
        let exists = true;
        while (exists) {
            slug = nanoid(7);
            exists = await LovePage.exists({ slug });
        }

        // Set Expiry (7 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Create the page
        const newPage = await LovePage.create({
            ...pageData,
            slug,
            expiresAt,
            isPaid: true // Mark true so the frontend loads the content normally
        });

        res.status(201).json({
            success: true,
            slug: newPage.slug,
            message: "Success! Your free love page is ready."
        });
    } catch (error) {
        console.error("CREATE ERROR:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3️⃣ GET LOVE PAGE BY SLUG
exports.getLovePageBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const page = await LovePage.findOne({ slug });

        if (!page) {
            return res.status(404).json({ success: false, message: "Love page not found" });
        }

        // Returns the object directly for your frontend logic
        res.json(page);
    } catch (error) {
        console.error("GET ERROR:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};