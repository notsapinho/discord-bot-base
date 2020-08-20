const { Command, UserArgument } = require("../../structures");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
        this.cooldown = 3000;

        this.extendedHelp = ["Mostra o avatar do usuario."];
        this.aliases = ["av", "profilepic", "pic"];
        this.args = [
            new UserArgument({
                name: "usuário",
                required: false,
                sameAuthor: true
            })
        ];
    }

    exec({ message }, [user]) {
        if (!message.flagArgs.guild) {
            message.send(new this.client.embed(user).setDescription(`:camera: **Avatar de [${user.username}](${user.displayAvatarURL({ dynamic: true, size: 2048 })})**`).setImage(user.displayAvatarURL({ dynamic: true, size: 2048 })));
        } else {
            const guild = message.flagArgs.guild == true ? message.guild : this.client.guilds.cache.get(message.flagArgs.guild) ? this.client.guilds.cache.get(message.flagArgs.guild) : message.guild;
            message.send(new this.client.embed(message.member).setDescription(`:camera: **Avatar de [${guild.name}](${guild.iconURL({ dynamic: true, size: 2048 })})**`).setImage(guild.iconURL({ dynamic: true, size: 2048 })));
        }
    }
};
