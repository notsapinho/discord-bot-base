module.exports = class BaseArgument {
    constructor(options) {
        this.name = options.name;
        this.type = options.type;
        this.missing = false;
        this.invalid = false;
        this.required = options.required || false;
        this.notAllowed = false;
    }

    _reset() {
        this.missing = false;
        this.invalid = false;
    }
};
