module.exports = class Ready {
    constructor(client) {
        this.client = client;
        this.name = "ready";
    }
    async exec() {
        this.client.log.success("READY!");
    }
};
