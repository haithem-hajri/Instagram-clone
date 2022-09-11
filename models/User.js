const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  socketId: {
    type: String,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default:
      "https://media.istockphoto.com/vectors/person-gray-photo-placeholder-man-vector-id1202490554?k=20&m=1202490554&s=612x612&w=0&h=Pkb9bPY7CT5whOt0yZDzGivGBs_CW2fAs0btjFaHCOg=",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});
module.exports = mongoose.model("User", UserSchema);
