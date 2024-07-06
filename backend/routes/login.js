const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/", (req, res) => {
    const body = req.body;
    console.log(body)

    User.findOne({ active: true, email: body.email })
        .then(userDB => {
            if (!userDB) {
                res.status(400).json({ ok: false, error: { message: "username not found" } })
            } else if (!bcrypt.compareSync(body.password, userDB.password)) {
                console.log(bcrypt.compareSync(body.password, userDB.password));
                res.status(400).json({ ok: false, error: { message: "invalid password" } })
            } else {
                const token = jwt.sign(
                    { userId: userDB._id, username: userDB.username },
                    process.env.SEED,
                    // { expiresIn: '4h' } 
                );
                res.status(200).json({ ok: true, token, user: userDB });

            }
        })
        .catch(error => {
            console.error("Error:", error)
            res.status(500).json({ ok: false, error })
        })
})

module.exports = router;