const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require('dotenv').config({ path: './config/.env' });

const secretKey = process.env.SEED;
const activationRoute = process.env.ACTIVATION_ROUTE || "http://localhost:5173"



router.post(
    "/",
    // Input validation
    body('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-ZñÑ0-9]+$/).withMessage('Username must not contain special characters'),
    body('email')
        .isEmail().withMessage('Invalid email address'),
    body('firstName')
        .not().isEmpty().withMessage('First name is required')
        .matches(/^[a-zA-ZñÑ]+$/).withMessage('First name must only contain alphabetic characters and "ñ"'),
    body('lastName')
        .not().isEmpty().withMessage('Last name is required')
        .matches(/^[a-zA-ZñÑ]+$/).withMessage('Last name must only contain alphabetic characters and "ñ"'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, errors: errors.array() });
        }

        const body = req.body;

        // Sanitize input
        const sanitizedUsername = body.username.trim().toLowerCase();
        const sanitizedEmail = body.email.trim().toLowerCase();
        const sanitizedFirstName = body.firstName.trim().toLowerCase();
        const sanitizedLastName = body.lastName.trim().toLowerCase();

        // Hash password with salt
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(body.password, saltRounds);

        try {
            // Check for duplicate users
            const existingUser = await User.findOne({ $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }] });
            if (existingUser) {
                return res.status(400).json({ ok: false, errors: [{ msg: 'Username or email already exists' }] });
            }

            const user = new User({
                username: sanitizedUsername,
                email: sanitizedEmail,
                firstName: sanitizedFirstName,
                lastName: sanitizedLastName,
                password: hashedPassword,
            });

            // Save the user to the database
            const savedUser = await user.save();

            // Create activation token
            const activationToken = jwt.sign(
                { userId: savedUser._id },
                secretKey,
                { expiresIn: '1h' }
            );

            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.MAIL_PASS
                },
            });
            const activationLink = `${activationRoute}/activate/${activationToken}`;

            const mailOptions = {
                from: {
                    name: "AlfonCode",
                    address: process.env.MAIL
                },
                to: `${sanitizedEmail}`,
                subject: "Account Activation",
                text: `Hello ${sanitizedFirstName}, please activate your account using the following link: ${activationLink}`,
                html: `
                    <div style="background-color: #2c2c2c; color: #fff; font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff;">Hello ${sanitizedFirstName}!</h1>
                        <p style="font-size: 18px;">Please activate your account using the following link:</p>
                        <a href="${activationLink}" style="display: inline-block; background-color: #444; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 18px;">Activate Account</a>
                        <p style="margin-top: 20px; font-size: 14px;">If the button above does not work, copy and paste the following link into your browser:</p>
                        <p style="color: #aaa;"><a href="${activationLink}" style="color: #aaa;">${activationLink}</a></p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log("Activation email has been sent!");

            res.status(201).json({
                ok: true,
                user: savedUser,
                token: activationToken
            });
        } catch (error) {

            res.status(500).json({
                ok: false,
                error: error.message
            });

        }
    }
);

router.get('/activate', (req, res) => {
    const token = req.query.token;
    console.log("token: ", token);

    if (!token) {
        return res.status(400).json({ ok: false, message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(400).json({ ok: false, message: 'Invalid or expired token' });
        }

        User.findByIdAndUpdate(decoded.userId, { active: true }, { new: true })
            .then(updatedUser => {
                if (!updatedUser) {
                    return res.status(404).json({ ok: false, message: 'User not found' });
                }
                res.status(200).json({ ok: true, message: 'Account activated', user: updatedUser });
            })
            .catch(error => {
                res.status(500).json({ ok: false, error: error.message });
            });
    });
});

module.exports = router;
