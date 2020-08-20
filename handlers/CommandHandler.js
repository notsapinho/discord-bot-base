const { requireDir } = require("../utils");

module.exports = class CommandHandler {
    constructor(client) {
        this.client = client;
    }

    init({ dir }) {
        requireDir({ dir }, (err, [file, path]) => {
            if (err) console.log(err);
            const command = new file(this.client, path);
            this.client.log.info(`[COMMAND] ${command.name} - loaded!`);
            this.client.commands.set(command.name, command);
        });
    }
};
