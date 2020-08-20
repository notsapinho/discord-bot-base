const BaseArgument = require("./BaseArgument");

module.exports = class UrlArgument extends BaseArgument {
    constructor(options) {
        super(options);
        this.type = "url";
    }
    parseArgument({ client, args }) {
        if (!args.length && this.required) this.missing = true;
        if (!/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(args.join(" "))) this.invalid = true;
        return {
            args,
            value: args.join(" ").startsWith("http") ? args.join(" ") : "https://" + args.join(" ")
        };
    }
};
