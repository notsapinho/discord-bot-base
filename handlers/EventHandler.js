const { requireDir } = require("../utils");

module.exports = class EventHandler {
    constructor(client) {
        this.client = client;
    }

    init({ dir }) {
        requireDir({ dir }, (err, [file]) => {
            if (err) console.log(err);
            const event = new file(this.client);
            this.client.log.info(`[EVENT] ${event.name} - loaded!`);
            this.client.on(event.name, (...params) => event.exec(...params));
        });
    }
};
