const { Structures, APIMessage } = require("discord.js");

module.exports = Structures.extend("Guild", (_Guild) => {
    class Guild extends _Guild {
        constructor(...args) {
            super(...args);
        }

        async db() {
            const check = await this.client.database.Guilds.findOne({ _id: this.id });
            if (check) return check;
            const document = new this.client.database.Guilds({ _id: this.id });
            document.save();
            return document;
        }
    }
    return Guild;
});
