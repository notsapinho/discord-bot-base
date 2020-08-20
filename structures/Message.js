const { Structures, APIMessage } = require("discord.js");

const quotes = ['"', "'", "“”", "‘’"];

const flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map((qu) => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join("|")}|([\\w<>@#&!-]+)))?`, "g");

function getFlags(content, delim) {
    const flags = {};
    content = content.replace(flagRegex, (match, fl, ...quote) => {
        flags[fl] = quote.slice(0, -2).find((el) => el)
            ? quote
                  .slice(0, -2)
                  .find((el) => el)
                  .replace(/\\/g, "")
            : true;
        return "";
    });
    if (delim) content = content.replace(new RegExp(`(${delim})(?:${delim})+`), "$1").trim();
    return {
        content,
        flags
    };
}

module.exports = Structures.extend("Message", (_Message) => {
    class Message extends _Message {
        constructor(...args) {
            super(...args);
            this._responses = [];

            this._setup(this.content);
        }
        get responses() {
            return this._responses.filter((msg) => !msg.deleted);
        }

        _setup(original) {
            let { content, flags } = getFlags(original, " ");
            super.content = content;
            this.flagArgs = flags;
        }

        async send(content, options) {
            const combinedOptions = APIMessage.transformOptions(content, options);

            if ("files" in combinedOptions) return this.channel.send(combinedOptions);
            const newMessages = new APIMessage(this.channel, combinedOptions)
                .resolveData()
                .split()
                .map((mes) => {
                    mes.data.embed = mes.data.embed || null;
                    mes.data.content = mes.data.content || null;
                    return mes;
                });

            const { responses } = this;
            const promises = [];
            const max = Math.max(newMessages.length, responses.length);

            for (let i = 0; i < max; i++) {
                if (i >= newMessages.length) responses[i].delete();
                else if (responses.length > i) promises.push(responses[i].edit(newMessages[i]));
                else promises.push(this.channel.send(newMessages[i]));
            }

            const newResponses = await Promise.all(promises);
            this._responses = newMessages.map((val, i) => responses[i] || newResponses[i]);

            return newResponses.length === 1 ? newResponses[0] : newResponses;
        }
    }
    return Message;
});
