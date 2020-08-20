const { Command } = require("../../structures");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
        this.cooldown = 3000;
        this.extendedHelp = ["Mostra minha latência."];
    }

    exec({ message }) {
        message.send(new this.client.embed().setDescription(`Minha latência é de \`${~~this.client.ws.ping}ms\``));
    }
};
