module.exports = ({ client, message }) => {
    const splitMessage = message.content.split(" ");
    const prefix = client.opts.prefixes.find((p) => message.content.startsWith(p));
    if (prefix) {
        const command = splitMessage[0].slice(prefix.length).toLowerCase();
        return client.commands.get(command) || client.commands.find((x) => x.aliases.includes(command));
    }
};
