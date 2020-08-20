const { Command } = require("../../structures");
const os = require("os");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
        this.cooldown = 3000;
        this.extendedHelp = ["Mostra informações sobre mim."];
        this.aliases = ["bi", "info"];
    }

    exec({ message }) {
        const embed = new this.client.embed(message.member)
            .setTitle(":information_source: Informações sobre mim!")
            .addField(`Meu nome`, this.client.util.codeBlock("ini", `[ ${this.client.user.username} ]`), true)
            .addField(`Meu ping`, this.client.util.codeBlock("ini", `[ ${~~this.client.ws.ping}ms ]`), true)
            .addField(`Comunidade`, this.client.util.codeBlock("ini", `[ ${this.client.guilds.cache.size} guilds ${this.client.users.cache.size} usuários e ${this.client.channels.cache.size} canais ]`))
            .addField(`Prefixo`, this.client.util.codeBlock("ini", `[ ${this.client.opts.prefixes[0]} ]`), true)
            .addField(`Estou acordado a`, this.client.util.codeBlock("ini", `[ ${new Date(this.client.uptime).toISOString().slice(11, 19)} ]`), true)
            .addField(`Fui criado por`, this.client.util.codeBlock("ini", `[ notsapinho#2975 ]`), true)
            .addField(`Me adicione`, "[**`CLIQUE AQUI`**](https://discord.com/api/oauth2/authorize?client_id=707341808384081970&permissions=8&scope=bot)", true)
            .addField(`Servidor de suporte`, "[**`CLIQUE AQUI`**](https://discord.gg/Ymsg8NE)", true);
        message.send(embed);
    }
};
