module.exports = class Command {
    constructor(client, file) {
        this.client = client;
        const bracks = file.includes("/") ? "/" : "\\";
        this.name = file
            .split(bracks)
            .slice(-1)
            .pop()
            .substr(0, file.split(bracks).slice(-1).pop().length - 3);
        this.category = file.split(bracks).slice(file.split(bracks).indexOf(this.client.opts.commands) + 1, -1)[0] ? file.split(bracks).slice(file.split(bracks).indexOf(this.client.opts.commands) + 1, -1)[0] : "utils";
        this.cooldownObj = {};
        this.args = [];
        this.aliases = [];
    }

    exec({ message }) {
        return message.send("corno do krl tu n definiu o exec");
    }

    get usage() {
        return ` ${this.aliases.length ? `《${this.aliases.map((a) => a).join("|")}》` : ""} ${this.args.map((arg) => `${arg.required ? `<${arg.name.toProperCase()}:${arg.type.toProperCase()}>` : `[${arg.name.toProperCase()}:${arg.type.toProperCase()}]`}`).join(" ")}`;
    }

    startCooldown(id) {
        if (this.cooldownObj[id] || this.client.owners.includes(id)) return;
        if (!this.cooldown) return;
        this.cooldownObj[id] = Date.now();
        setTimeout(() => delete this.cooldownObj[id], this.cooldown);
    }

    transformCooldown(user) {
        if (!this.cooldownObj[user.id]) return;
        return `**Espere \`${new Date(this.cooldown - Math.round((Date.now() - this.cooldownObj[user.id]) / 1000)).toISOString().slice(11, 19)}\` pra usar esse comando novamente!**`;
    }
};
