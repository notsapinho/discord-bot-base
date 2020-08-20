const BaseArgument = require("./BaseArgument");

module.exports = class StringArgument extends BaseArgument {
    constructor(options) {
        super(options);
        this.type = "string";
        this.full = options.full;
        this.length = options.length || 1;
        this.lengthRequired = this.lengthRequired || this.length;
        this.maxStringLength = options.maxStringLength || 100;
        this.canBeNumber = options.canBeNumber || false;
        this.allowed = options.allowed || [];
    }
    parseArgument({ args }) {
        const string = [];
        if (this.full) {
            this.length = args.length;
            this.maxStringLength = args.join(" ").length;
        }
        for (let i = 0; i < this.length; i++) {
            if (!args[i] && i < this.lengthRequired) {
                this.missing = true;
            } else if (!isNaN(args[i]) && !this.canBeNumber) {
                this.invalid = true;
            } else {
                string.push(args[i]);
            }
        }
        args = args.slice(this.length);

        if (!args.length && !string.length && this.required && !this.invalid) this.missing = true;
        if (string.join(" ").length > this.maxStringLength) this.invalid = true;
        if (this.allowed.length && !this.allowed.some((x) => string[0] == x)) this.notAllowed = true;

        return {
            args,
            value: string.join(" ").trim()
        };
    }
};
