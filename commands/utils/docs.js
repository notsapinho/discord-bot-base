const { Command, StringArgument } = require("../../structures");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(...args) {
        super(...args);

        this.cooldown = 5000;

        this.extendedHelp = ["Procura nas docs da Discord.js."];
        this.aliases = ["djs"];

        this.args = [
            new StringArgument({
                name: "query",
                required: true,
                canBeNumber: true,
                full: true
            })
        ];
    }

    async exec({ message }, [query]) {
        const res = await (await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${message.flagArgs.master ? "master" : "stable"}&q=${query}`)).json();
        message.send(new this.client.embed(message.member, res));
    }
};
