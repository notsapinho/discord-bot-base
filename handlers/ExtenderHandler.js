const { requireDir } = require("../utils");

module.exports = class ExtenderHandler {
    constructor(client) {
        this.client = client;
    }

    init({ dir }) {
        requireDir({ dir }, (err, [file]) => {
            if (err) console.log(err);
            const extender = new file();
            this.client[extender.name] = file;
            this.client.log.info(`[EXTENDER] ${extender.name} - loaded!`);
        });
    }
};
