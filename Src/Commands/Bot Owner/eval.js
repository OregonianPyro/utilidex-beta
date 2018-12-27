const Command = require('../../Base/Command.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            category: 'bot owner',
            description: 'Evaluates JavaScript code.',
            usage: '{prefix}eval <code>',
            parameters: 'stringCode',
            extended: false,
            guildOnly: true,
            devOnly: true,
            supportOnly: false,
            perms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            aliases: ['e']
        });
    };

    async run(message, args) {
        if (!args[0]) return;
        let flag;
        if (message.content.split('--')[1]) {
            flag = message.content.split('--')[1].toLowerCase();
        } else { flag = null };
        const content = !flag ? args.join(' ') : args.join(' ').split('--')[0];
        const result = new Promise((resolve, reject) => resolve(eval(content)));
        return result.then(async output => {
            if (typeof output !== 'string') output = require('util').inspect(output, {
                depth: 0
            });
            if (output.includes(process.env.TOKEN)) output = output.replaceAll(process.env.TOKEN, '[TOKEN]');
            if (output.length > 1024) return console.log(output), message.responder.embed({
                color: 'GOLD',
                tite: '**Eval Success**',
                description: `${this.client.store.emotes.warn} **Length too long, check the console.**`
            });
            if (flag === 'silent') return;
            return message.responder.embed({
                color: 'GREEN',
                fields: [{
                    name: `**${this.client.store.emotes.check} Eval Success**`,
                    value: `\`\`\`${output}\`\`\``
                }]
            });
        }).catch(err => {
            console.error(err);
            err = err.toString();
            if (err.includes(process.env.TOKEN)) err = err.replaceAll(process.env.TOKEN, '[TOKEN]');
            return message.responder.embed({
                color: 'RED',
                fields: [{
                    name: `**${this.client.store.emotes.x} Eval Fail**`,
                    value: `\`\`\`${err}\`\`\``
                }]
            });
        });
    };
};