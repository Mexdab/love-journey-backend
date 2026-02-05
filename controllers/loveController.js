const LovePage = require("../models/LovePage");

exports.createLovePage = async (req, res) => {
    const { yourName, partnerName, firstMeeting, memory, message, photos } = req.body;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const page = await LovePage.create({
        yourName,
        partnerName,
        firstMeeting,
        memory,
        message,
        photos,
        expiresAt
    });

    res.json(page);
};

exports.getLovePageById = async (req, res) => {
    const page = await LovePage.findById(req.params.id);
    if (!page) return res.status(404).json({ msg: "Not found" });

    res.json(page);
};
