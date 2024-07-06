const express = require("express");
const router = express.Router();
const User = require("../models/user")
const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const authenticateToken = require("./auth");


router.get("/:id", authenticateToken, (req, res) => {

    const id = req.params.id

    User.find({ active: true, _id: id }).exec()
        .then(users => {
            res.status(200).json({ ok: true, users });
        })
        .catch(error => {
            res.status(400).json({ ok: false, error });
        });
});

router.get("/contact/:id", authenticateToken, (req, res) => {

    const id = req.params.id

    User.find({ active: true, _id: id }).select("_id username firstName lastName").exec()
        .then(users => {
            res.status(200).json({ ok: true, users });
        })
        .catch(error => {
            res.status(400).json({ ok: false, error });
        });
});

router.get("/user/:username", authenticateToken, (req, res) => {

    const username = req.params.username;

    User.findOne({ active: true, username: username }).exec()
        .then(user => {
            if (user) {
                const id = user._id
                const username = user.username; // Extracting username
                res.status(200).json({ ok: true, username, id }); // Sending only username
            } else {
                res.status(404).json({ ok: false, message: "User not found" });
            }
        })
        .catch(error => {
            res.status(400).json({ ok: false, error });
        });
});

router.put("/password/:id", authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body

        User.findById(id)
            .then(async userDB => {
                console.log("userDB: ", userDB);
                if (!userDB) {
                    res.status(400).json({ ok: false, error: "user not found" })
                } else if (!bcrypt.compareSync(body.oldPassword, userDB.password)) {
                    res.status(403).json({ ok: false, error: "Incorrect old password" })
                } else {
                    const newPassword = bcrypt.hashSync(body.password, 10);
                    const testPassword = { password: newPassword }
                    updatedUser = await User.findByIdAndUpdate(
                        id,
                        { $set: testPassword },
                        { new: true, runValidators: true }
                    );
                    res.status(200).json({ ok: true, message: "Password changed correctly" })
                }

            })
    } catch (error) {
        console.error(error);
        res.status(400).json({ ok: false, error });
    }
})


router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body
        // console.log("body: ", body);
        // console.log("body.contacts: ", body.contacts);
        // console.log("body.contacts.length: ", body.contacts.length);

        let updatedUser;

        // Check if the request contains a removeContact field
        if (body.removeContact) {
            updatedUser = await User.findByIdAndUpdate(
                id,
                { $pull: { contacts: { contactId: body.removeContact } } },
                { new: true, runValidators: true }
            );
        } else if (body.contacts) {
            // Correctly structure the new contact object
            const contactsWithTimestamp = {
                contactId: body.contacts.contactId,
                timestamp: new Date()
            };

            updatedUser = await User.findByIdAndUpdate(
                id,
                { $addToSet: { contacts: contactsWithTimestamp } }, // Directly use contactsWithTimestamp here
                { new: true, runValidators: true }
            );
        } else {
            console.log("here2");

            updatedUser = await User.findByIdAndUpdate(
                id,
                { $set: body },
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({ ok: true, updatedUser });
    } catch (error) {
        console.error(error);
        res.status(400).json({ ok: false, error });
    }
});

router.put("/removeContacts", authenticateToken, async (req, res) => {
    try {
        const body = req.body;


        if (body.removeContact) {
            const contactId = body.removeContact;

            // Update all todos where the collaborator's userId matches the provided one
            const updatedUsers = await User.updateMany(
                { contacts: contactId },
                { $pull: { contacts: contactId } },
                { new: true, runValidators: true }
            );

            res.status(200).json({ ok: true, updatedUsers });
        } else {
            res.status(400).json({ ok: false, error: "removeContact field is required" });
        }
    } catch (error) {

        console.error(error);
        res.status(400).json({ ok: false, error });
    }
});


router.delete("/removeAccount/:id", authenticateToken, async (req, res) => {
    try {
        const { body } = req;
        const { id } = req.params;
        console.log(body);

        // Update the user to set active to false
        const updatedUser = await User.findByIdAndUpdate(id,
            { active: false },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ ok: false, error: "User not found" });
        }

        // If removeContact is provided, update the contacts
        if (body.removeContact) {
            console.log("users1");
            console.log(body.removeContact);
            const contactId = new mongoose.Types.ObjectId(body.removeContact);

            const updatedUsers = await User.updateMany(
                { contacts: contactId },
                { $pull: { contacts: contactId } },
                { new: true, runValidators: true }
            );

            return res.status(200).json({ ok: true, updatedUser, updatedUsers });
        } else {
            return res.status(200).json({ ok: true, updatedUser });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Internal server error" });
    }
});


module.exports = router;