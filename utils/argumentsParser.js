module.exports = async ({ client, message, command }) => {
    const startWithPrefix = client.opts.prefixes.find((p) => message.content.startsWith(p));
    let args = message.content.split(/ +/).slice(startWithPrefix ? 1 : 2);
    const parsedArgs = [];
    for (const argument of command.args) {
        argument._reset();
        const result = await argument.parseArgument({ client, message, args });
        if (!(!argument.required && argument.missing)) {
            args = result.args;
        }
        if (argument.required) {
            if (argument.missing) {
                message.send(new client.embed().red().setDescription(argument.missingMessage || `O argumento \`${argument.name.toProperCase()}\` é necessário!`));
                return false;
            } else if (argument.invalid) {
                message.send(new client.embed().red().setDescription(argument.invalidMessage || `O argumento \`${argument.name.toProperCase()}\` não é do tipo \`${argument.type.toProperCase()}\`!`));
                return false;
            }
        }
        if (argument.notAllowed) {
            message.send(new client.embed().red().setDescription(argument.notAllowedMessage || `O argumento \`${argument.name.toProperCase()}\` precisa ser alguma dessas opções \`${argument.allowed.join(", ")}\`!`));
            return false;
        }
        parsedArgs.push(result.value);
    }
    return parsedArgs;
};
