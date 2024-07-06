const express = require("express");
const router = express.Router();
const authenticateToken = require("./auth");
const ContactRequest = require("../models/contactRequest");

router.post("/", authenticateToken, (req,res) => {
    let body = req.body

    const contactRequest = new ContactRequest({
        sender: body.sender,
        recipient: body.recipient,
    })
    
    contactRequest.save()
    .then(savedContactRequest => {
        res.status(201).json({
            ok: true, 
            savedContactRequest: savedContactRequest
        })
    })
    .catch(error => {
        if (error.code === 11000) { // Duplicate key error code
            res.status(400).json({
                ok: false,
                error: "Duplicate contact request"
            });
        } else {
            console.error("Error saving contact request:", error);
            res.status(500).json({
                ok: false,
                error: "Internal Server Error"
            })
        }
    })
})


router.get("/pending/:id", authenticateToken, (req, res) => {
    const userId = req.params.id; // Assuming the token payload contains an 'id' field

    ContactRequest.find({ status: "PENDING", sender: userId }) // Only find todos for the logged-in user
        .exec()
        .then(receivedRequests => {
            res.status(200).json({ ok: true, receivedRequests: receivedRequests });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ ok: false, error });
        });
});

router.get("/received/:id", authenticateToken, (req, res) => {
    const userId = req.params.id; // Assuming the token payload contains an 'id' field

    ContactRequest.find({ status: "PENDING", recipient: userId }) // Only find todos for the logged-in user
        .exec()
        .then(receivedRequests => {
            res.status(200).json({ ok: true, receivedRequests: receivedRequests });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ ok: false, error });
        });
});


router.put("/:id", (req,res) => {
    const id = req.params.id;
    const body = req.body

    ContactRequest.findByIdAndUpdate(id,
        body,
        {new: true, runValidators: true})
    .then(updatedContactRequest => {
        res.status(200).json({ok: true, updatedContactRequest})
    })
    .catch(error => {
        res.status(400).json({ok: false, error})
    })
})

router.delete("/:id", authenticateToken, (req,res) => {
    const id = req.params.id;

    ContactRequest.findByIdAndDelete(id,
        {active: false},
        {new: true, runValidators: true})
    .then(removedRequest => {
        if (removedRequest) {
            res.status(200).json({ok: true, removedRequest})
        } else {
            res.status(400).json({ok: false, error: "request not found"})
        }
    })
    .catch(error => {
        res.status(400).json({ok: false, error})
    })
})


router.get("/:sender/:recipient", authenticateToken, (req, res) => {
    const {sender, recipient} = req.params;

    ContactRequest.find({ sender: {$in: [sender, recipient]}, recipient: {$in: [sender, recipient]} })
        .exec()
        .then(receivedRequests => {
            res.status(200).json({ ok: true, receivedRequests: receivedRequests });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ ok: false, error });
        });
});

module.exports = router;

