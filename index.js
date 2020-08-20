const { Client } = require("./structures");

require("./structures");

const client = new Client({ prefixes: ["!", "!!"], restRequestTimeout: 30000, owners: ["693288915427262585"], fetchAllMembers: true });

client.init();

module.exports = client;
