const { Schema, model } = require("mongoose");

const GuildSchema = new Schema({
    _id: { type: String, required: true },
    lang: { type: String, default: "ptBR" }
});

module.exports = new model("Guilds", GuildSchema);
