const BaseArgument = require("./BaseArgument");

module.exports = class CommandArgument extends BaseArgument {
    constructor(options) {
        super(options);
        this.type = "comando";
    }
    parseArgument({ client, args }) {
        const cmd = client.commands.get(args.join(" ")) || client.commands.find((x) => x.aliases.includes(args.join(" ")));
        if (!cmd && this.required) this.missing = true;
        args = args.slice(1);
        return {
            args,
            value: cmd
        };
    }
};
