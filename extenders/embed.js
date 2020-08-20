const { MessageEmbed } = require("discord.js");
const { hexColors } = require("../utils");

module.exports = class Embed extends MessageEmbed {
    constructor(member, obj = {}) {
        super(obj);
        this.name = "embed";

        for (const name in hexColors) {
            this[name] = () => this.setColor(hexColors[name]);
        }

        this.setColor("RED");
        if (member)
            this.setTimestamp()
                .setColor(member.roles ? (member.roles.highest.hexColor != "#000000" ? member.roles.highest.hexColor : "RED") : "RED")
                .setFooter(member.roles ? member.user.username : member.username, member.roles ? member.user.displayAvatarURL({ dynamic: true, size: 2048 }) : member.displayAvatarURL({ dynamic: true, size: 2048 }));
    }
};
