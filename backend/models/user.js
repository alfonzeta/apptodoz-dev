const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    firstName: {
        type: String,
        required: [true, "Name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
    },
    contacts: [{
        contactId: { type: Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now }
    }],
    password: {
        type: String,
        required: [true, "password is required"]
    },
    active: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: [true, "Timestamp is required"]
    }
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password
    return userObject;
}

module.exports = mongoose.model("User", userSchema)