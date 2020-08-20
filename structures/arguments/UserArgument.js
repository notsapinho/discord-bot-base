const BaseArgument = require("./BaseArgument");

module.exports = class UserArgument extends BaseArgument {
    constructor(options) {
        super(options);
        this.type = "user";
        this.needMember = options.needMember;
        this.sameAuthor = options.sameAuthor;
    }
    findMember(guild, name) {
        if (!name) return;
        const member = guild.members.cache.filter((a) => a.displayName.toLowerCase().includes(name.toLowerCase()) || (name.toLowerCase().includes(a.displayName.toLowerCase()) && a.displayName >= name.length) || a.user.username.toLowerCase().includes(name.toLowerCase()) || (name.toLowerCase().includes(a.user.username.toLowerCase()) && a.user.username.length >= name.length));
        return member.sort((a, b) => a.displayName.length - b.displayName.length).first();
    }
    async parseArgument({ client, message, args }) {
        let user;
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
            args = args.slice(1);
        } else if (await client.users.fetch(args[0]).catch(() => null)) {
            user = await client.users.fetch(args[0]);
            args = args.slice(1);
        } else if (this.findMember(message.guild, args[0])) {
            user = this.findMember(message.guild, args[0]).user;
            args = args.slice(1);
        }
        if (!user) user = message.author;
        if (user.id === message.author.id && !this.sameAuthor) this.invalid = true;
        if (this.needMember) {
            user = await message.guild.members.fetch(user.id).catch(() => null);
            if (!user) this.invalid = true;
        }

        return {
            args,
            value: user
        };
    }
};
