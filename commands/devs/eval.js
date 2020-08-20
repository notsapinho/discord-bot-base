const { inspect } = require("util");
const Discord = require("discord.js");
const { Command, StringArgument } = require("../../structures");

const splitText = (msg, division) => {
    if (msg.length <= division) return msg;

    const endElement = () => {
        ranText = ranText.trim();
        msgs.push(ranText);
        ranText = "";
    };

    const msgs = [];
    let ranText = "";
    const split = msg.split("\n");
    for (let i = 0; i < split.length; i++) {
        ranText += `${split[i]}\n`;
        if (ranText.length > division) endElement();
    }

    endElement();
    return msgs;
};

module.exports = class extends Command {
    constructor(...args) {
        super(...args);
        this.aliases = ["ev", "e", "exec"];
        this.extendedHelp = ["Este comando executa códigos enviados pelo úsuario.", "--async executa o codigo como uma função assincrona, --silent não envia nenhuma mensagem de resultado."];
        this.only = this.client.owners;
        this.args = [
            new StringArgument({
                name: "code",
                required: true,
                full: true,
                canBeNumber: true
            })
        ];
    }

    async exec({ message, t }, [code]) {
        let { success, result, type } = await this.eval(message, t, code);

        result = result.replace(/message.guild.members.cache.get\("(\d{16,18})"\)/g, "<@$1>");

        if (result.length > 2048) {
            let page = 0;
            const pages = splitText(result, 1024);
            message.send(success ? `:outbox_tray: **Output:**\n${this.client.util.codeBlock("js", pages[page])}\n:question: **Tipo**:${this.client.util.codeBlock("js", type)}` : `${this.client.emotes.x} **Erro:**:${this.client.util.codeBlock("js", pages[page])}`).then(async (msg) => {
                await msg.react("⬅️");
                await msg.react("⏪");
                await msg.react("⏹️");
                await msg.react("⏩");
                await msg.react("➡️");

                const collector = msg.createReactionCollector((r, u) => ["⬅️", "➡️", "⏹️", "⏪", "⏩"].includes(r.emoji.name) && u.id == message.author.id, { time: 120000 });

                collector.on("collect", async (r) => {
                    switch (r.emoji.name) {
                        case "⏪":
                            if (page === 0) return;
                            page = 0;
                            break;
                        case "⬅️":
                            if (page === 0) return;
                            page--;
                            break;
                        case "⏹️":
                            collector.stop();
                            break;
                        case "➡️":
                            if (page === pages.length - 1) return;
                            page++;
                            break;
                        case "⏩":
                            if (page === pages.length - 1) return;
                            page = pages.length - 1;
                            break;
                    }
                    if (["⏹️"].includes(r.emoji.name)) return;
                    if (message.channel.permissionsFor(this.client.user).has("MANAGE_MESSAGES")) r.users.remove(message.author);
                    msg.edit(success ? `:outbox_tray: **Output:**\n${this.client.util.codeBlock("js", pages[page])}\n:question: **Tipo**:${this.client.util.codeBlock("js", type)}` : `${this.client.emotes.x} **Erro:**:${this.client.util.codeBlock("js", pages[page])}`);
                });
                collector.on("end", (c, reason) => {
                    if (message.channel.permissionsFor(this.client.user).has("MANAGE_MESSAGES")) return msg.reactions.removeAll();
                    msg.delete();
                });
            });
            return;
        }

        if ("silent" in message.flagArgs) return null;

        return message.send(success ? `:outbox_tray: **Output:**\n${this.client.util.codeBlock("js", result)}\n:question: **Tipo**:${this.client.util.codeBlock("js", type)}` : `${this.client.emotes.x} **Erro:**:${this.client.util.codeBlock("js", result)}`);
    }

    async eval(message, t, code) {
        code = code.replace(/^`{3}(js)?|`{3}$/g, "");
        code = code.replace(/(<@!?(\d{16,18})>)/g, 'message.guild.members.cache.get("$2")');

        const { flagArgs: flags } = message;
        let success, result;
        let type;
        try {
            if (flags.async) code = `(async () => {\n${code}\n})();`;
            result = await eval(code);
            type = typeof result;
            success = true;
        } catch (error) {
            if (!type) type = typeof error;
            result = error;
            success = false;
        }

        if (typeof result !== "string") {
            result = inspect(result, {
                depth: flags.depth ? parseInt(flags.depth) || 0 : 0,
                showHidden: Boolean(flags.showHidden)
            });
        }

        return {
            success,
            type,
            result: this.client.util.clean(result)
        };
    }
};
