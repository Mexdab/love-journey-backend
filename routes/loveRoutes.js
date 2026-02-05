const express = require("express");
const router = express.Router();
const { createLovePage, getLovePageById } = require("../controllers/loveController");

router.post("/create", createLovePage);
router.get("/:id", getLovePageById);

module.exports = router;
