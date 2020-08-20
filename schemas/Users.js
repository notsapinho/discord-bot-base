const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    _id: { type: String, required: true }
});

module.exports = new model("Users", UserSchema);
