const { Client: _Client, Collection } = require("discord.js");
const Database = require("./Database");
const { EventHandler, CommandHandler, ExtenderHandler, PrototypeHandler } = require("../handlers");
const { Emojis } = require("../utils");
const Util = require("./Util");

require("dotenv/config");

module.exports = class Client extends _Client {
    constructor(opts) {
        super(opts);

        this.opts = opts;

        this.log = require("consola");

        this.emotes = Emojis;
        this.util = Util;

        this.opts.events = opts.events || "events";
        this.opts.commands = opts.commands || "commands";
        this.opts.extenders = opts.extenders || "extenders";
        this.opts.prototypes = opts.prototypes || "prototypes";

        this.owners = opts.owners || [];

        this.database = Database;

        this.commands = new Collection();
    }

    init(token = process.env.TOKEN) {
        new EventHandler(this).init({ dir: this.opts.events });
        new CommandHandler(this).init({ dir: this.opts.commands });
        new ExtenderHandler(this).init({ dir: this.opts.extenders });
        new PrototypeHandler(this).init({ dir: this.opts.prototypes });
        super.login(token).catch((err) => new Error("Invalid Token", err));
    }
};
