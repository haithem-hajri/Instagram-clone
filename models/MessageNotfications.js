const mongoose = require("mongoose"); // Erase if already required
const { ObjectId } = mongoose.Schema;
const messagenotificationSchema = new mongoose.Schema(
  {
    receiver: { type: ObjectId, ref: "User" },
    sender: { type: ObjectId, ref: "User" },
    readed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//Export the model
module.exports = mongoose.model("Messagenotification", messagenotificationSchema); 
