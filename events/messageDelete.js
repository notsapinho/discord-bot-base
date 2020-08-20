module.exports = class messageDelete {
    constructor(client) {
        this.client = client;
        this.name = "messageDelete";
    }
    exec(message) {
        for (const msg of message.responses) {
            msg.delete();
        }
    }
};
