const { Command, CommandArgument } = require("../../structures");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);

        this.cooldown = 3000;

        this.aliases = ["h", "ajuda", "comandos"];
        this.extendedHelp = ["Você já está aqui 😳!"];
        this.args = [
            new CommandArgument({
                name: "comando",
                required: false
            })
        ];

        this.translators = {
            devs: "Desenvolvedores",
            utils: "Utilidades",
            nsfw: "Pornôgrafia"
        };
    }

    exec({ message }, [command]) {
        if (command) {
            return message.send(
                new this.client.embed(message.member)
                    .setThumbnail(this.client.user.displayAvatarURL({ size: 2048 }))
                    .setTitle(`⚙️ **Comando: \`${command.name}\`**`)
                    .setDescription(`\`\`\`ini\n[ Explicação ]\n\n${command.extendedHelp.map((x) => `; ${x}`).join("\n")}\n\n[ Modo de uso ]\n\n${command.usage ? `; ${this.client.opts.prefixes[0]}${command.name}${command.usage}` : "; Não feito"}\n\n\`\`\``)
            );
        } else {
            let commands = new Map();

            this.client.commands.forEach((command) => {
                const category = commands.get(command.category);
                if (category) category.push(command);
                else commands.set(command.category, [command]);
            });

            const pages = [];

            for (const [category, list] of commands) {
                pages.push(new this.client.embed(message.member).setDescription(`\`\`\`ini\n[ ${this.translators[category] || category} ]\n\n${list.map((c) => `; ${this.client.opts.prefixes[0]}${c.name} -> ${c.extendedHelp[0]}`).join("\n")}\n\`\`\``));
            }

            let page = 0;
            message.send(pages[page]).then(async (msg) => {
                await msg.react("⬅️");
                await msg.react("⏹️");
                await msg.react("➡️");

                const collector = msg.createReactionCollector((r, u) => ["⬅️", "⏹️", "➡️"].includes(r.emoji.name) && u.id == message.author.id, { time: 120000 });

                collector.on("collect", async (r) => {
                    switch (r.emoji.name) {
                        case "⬅️":
                            {
                                if (page === 0) return;
                                page--;
                            }
                            break;
                        case "⏹️":
                            {
                                collector.stop();
                            }
                            break;
                        case "➡️":
                            {
                                if (page === pages.length - 1) return;
                                page++;
                            }
                            break;
                    }
                    if (["⏹️"].includes(r.emoji.name)) return;
                    if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) r.users.remove(message.author);
                    msg.edit(pages[page]);
                });
                collector.on("end", (c, reason) => {
                    if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return msg.reactions.removeAll();
                    msg.delete();
                });
            });
        }
    }
};
