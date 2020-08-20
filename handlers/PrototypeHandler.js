const { requireDir } = require("../utils");

module.exports = class PrototypeHandler {
    constructor(client) {
        this.client = client;
    }

    init({ dir }) {
        requireDir({ dir }, async (err, [file, path]) => {
            if (err) console.log(err);

            const bracks = path.includes("/") ? "/" : "\\";

            const name = path
                .split(bracks)
                .slice(-1)
                .pop()
                .substr(0, path.split(bracks).slice(-1).pop().length - 3);

            const protoName = path.split(bracks).slice(path.split(bracks).indexOf(this.client.opts.prototypes) + 1, -1)[0];

            const proto = eval(`${protoName}.prototype`);

            Object.defineProperty(proto, name, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: file
            });

            this.client.log.info(`[PROTOTYPE] ${name} - loaded!`);
        });
    }
};
