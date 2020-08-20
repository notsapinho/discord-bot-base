const { getCommand, runCommand } = require("../utils");

module.exports = class Message {
    constructor(client) {
        this.client = client;
        this.name = "message";
    }
    async exec(message) {
        if (message.content.startsWith(`<@!${this.client.user.id}>`) || message.content.startsWith(`<@${this.client.user.id}>`)) return message.channel.send(new this.client.embed().setDescription("**Olá! Use `x!ajuda` para saber mais sobre meus comandos!**"));

        if (message.guild && !message.author.bot) {
            const command = getCommand({ client: this.client, message });

            if (command) runCommand({ client: this.client, command, message });
        }
    }
};
