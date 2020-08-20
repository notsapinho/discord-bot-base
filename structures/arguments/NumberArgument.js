const BaseArgument = require("./BaseArgument");

module.exports = class NumberArgument extends BaseArgument {
    constructor(options) {
        super(options);
        this.type = "number";
        this.max = options.max || 1000000;
        this.min = options.min || 0;
        this.float = options.float;
    }
    parseArgument({ args }) {
        if (!args[0]) this.missing = true;
        if (isNaN(args[0])) this.invalid = true;
        const number = this.float ? parseFloat(args[0]) : parseInt(args[0]);
        if (number > this.max || this.min > number) this.invalid = true;
        args = args.slice(1);
        return {
            args,
            value: number
        };
    }
};
