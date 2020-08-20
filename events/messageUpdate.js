module.exports = class messageUpdate {
    constructor(client) {
        this.client = client;
        this.name = "messageUpdate";
    }
    exec(oldM, newM) {
        if (oldM.content !== newM.content) {
            newM._setup(newM.content);
            this.client.emit("message", newM);
        }
    }
};
