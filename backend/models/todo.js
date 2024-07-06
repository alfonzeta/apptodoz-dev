const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const options = { year: 'numeric', month: 'long', day: 'numeric' };



const validStatus = {
    values: ["todo", "in progress", "done", "archived"],
    message: "{VALUE} is not a valid status"
}

let todoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: [true, 'User ID is required']
    },
    author: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        username: {
            type: String,
            required: [true, "Author's username is required"]
        },
        firstName: {
            type: String,
            required: [true, "Author's first name is required"]
        },
        lastName: {
            type: String,
            required: [true, "Author's last name is required"]
        }
    },
    collaborator: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        username: {
            type: String
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        timestampCollaborator: {
            type: Date,
            default: function () {
                let currentDateCollaborator = new Date();
                return currentDateCollaborator;
            }
        }
    }],
    title: {
        type: String,
        required: [true, "Todo title is required"]
    },
    completed: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    timestamp: {
        type: Date,
        default: function () {
            let currentDate = new Date();
            return currentDate;
        },
        required: [true, "Timestamp is required"]
    },
    status: {
        type: String,
        enum: validStatus
    },
    deadline:
    {
        type: Date,
        default: function () {
            // Setting the deadline to 7 days from the timestamp
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 7);
            return currentDate;
        }
    }
});


module.exports = mongoose.model("todo", todoSchema)