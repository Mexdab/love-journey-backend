const Razorpay = require("razorpay");
const crypto = require("crypto");
const { nanoid } = require("nanoid");

const LovePage = require("../models/LovePage");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 💰 FIXED PRICE (₹20)
const AMOUNT_IN_PAISE = 2000; // 20 * 100
const CURRENCY = "INR";

// 1️⃣ CREATE RAZORPAY ORDER
exports.createOrder = async (req, res) => {
    try {
        const order = await razorpay.orders.create({
            amount: AMOUNT_IN_PAISE,
            currency: CURRENCY,
            receipt: `receipt_${Date.now()}`
        });

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.error("ORDER ERROR:", error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};

// 2️⃣ VERIFY PAYMENT + CREATE LOVE PAGE
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            formData
        } = req.body;

        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature ||
            !formData
        ) {
            return res.status(400).json({ success: false, message: "Invalid payload" });
        }

        // 🔐 Signature verification
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(401).json({ success: false, message: "Payment verification failed" });
        }

        // ✅ PAYMENT VERIFIED — CREATE LOVE PAGE
        const slug = nanoid(7);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const lovePage = await LovePage.create({
            ...formData,
            slug,
            isPaid: true,
            expiresAt
        });

        res.json({
            success: true,
            slug,
            lovePageId: lovePage._id
        });

    } catch (error) {
        console.error("VERIFY ERROR:", error);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};
