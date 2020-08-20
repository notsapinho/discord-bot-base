const { Command } = require("../../structures");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
        this.cooldown = 3000;
        this.only = this.client.owners;
        this.extendedHelp = ["Mostra todos os servidores que eu estou."];
    }

    async exec({ message }) {
        let page = 0;
        const pages = this.client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .array()
            .chunk(10);

        let i = 1;
        i = 9 * page + (page + 1);
        message.send(new this.client.embed(message.member).setDescription(this.client.util.codeBlock("ini", "[ DREADHOT ]\n\n" + pages[page].map((guild) => `; ${i++}. ${guild.name} - ${guild.memberCount}`).join("\n")))).then(async (msg) => {
            if (pages.length <= 1) return;
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
                i = 9 * page + (page + 1);
                msg.edit(new this.client.embed(message.member).setDescription(this.client.util.codeBlock("ini", "[ DREADHOT ]\n\n" + pages[page].map((guild) => `; ${i++}. ${guild.name} - ${guild.memberCount}`).join("\n"))));
            });
            collector.on("end", (c, reason) => {
                if (message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return msg.reactions.removeAll();
                msg.delete();
            });
        });
    }
};
