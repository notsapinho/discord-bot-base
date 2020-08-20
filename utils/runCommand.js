const argumentsParser = require("./argumentsParser");

module.exports = async ({ client, message, command }) => {
    if (command.cooldownObj[message.author.id]) return message.send(new client.embed(message.member).setDescription(command.transformCooldown(message.author)));
    if (command.only) {
        if (!command.only.includes(message.author.id)) return message.send(new client.embed(message.member).setDescription(`**${client.emotes.x} | Você não é um dos meus desenvolvedores!**`));
    }
    if (command.perms && command.perms.length) {
        if (!message.member.permissions.some((p) => command.perms.includes(p))) return message.send(new client.embed(message.member).setDescription(`**Você não tem possue \`${command.perms.join(", ")}\` para poder executar este comando**`));
    }

    if (command.nsfw && !message.channel.nsfw) return message.channel.send(new client.embed().red().setDescription("Este canal não é apropiado para este conteúdo!"));

    const commandArguments = await argumentsParser({ client, message, command });
    if (!commandArguments) return;

    command.exec({ message }, commandArguments);
    command.startCooldown(message.author.id);
};
