const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const validStatus = {
    values: ["PENDING", "ACCEPTED", "DECLINED"],
    message: "{VALUE} is not a valid status"
}

let contactRequestSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      status: {
        type: String,
        enum: validStatus,
        default: 'PENDING'
      },
      sentAt: {
        type: Date,
        default: Date.now
      },
      respondedAt: {
        type: Date
      }
    });

    // Define a unique compound index on sender and recipient fields
    contactRequestSchema.index({ sender: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model("ContactRequest", contactRequestSchema)