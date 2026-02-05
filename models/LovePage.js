const mongoose = require("mongoose");

const lovePageSchema = new mongoose.Schema({
    yourGender: { type: String, required: true },
    yourName: { type: String, required: true },

    partnerGender: { type: String, required: true },
    partnerName: { type: String, required: true },

    firstMeeting: { type: String, required: true },
    favoriteMemory: { type: String, required: true },

    message: { type: String, required: true },

    photos: [{ type: String }],

    music: { type: String, default: null },
    theme: { type: String, default: "default" },

    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

module.exports = mongoose.model("LovePage", lovePageSchema);
