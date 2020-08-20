const { Structures } = require("discord.js");

module.exports = Structures.extend("User", (_User) => {
    class User extends _User {
        constructor(...args) {
            super(...args);
        }

        async db() {
            const check = await this.client.database.Users.findOne({ _id: this.id });
            if (check) return check;
            const document = new this.client.database.Users({ _id: this.id });
            document.save();
            return document;
        }
    }
    return User;
});
