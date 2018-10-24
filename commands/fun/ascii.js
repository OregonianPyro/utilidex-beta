const Command = require('../../base/command.js');
const figlet = require('figlet');

class Ascii extends Command {
    constructor(client) {
        super(client, {
            name: 'ascii',
            category: 'fun',
            description: 'Sends ascii text, fancy right?',
            usage: '{prefix}ascii <text>',
            parameters: 'stringText',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: false,
            permission: 'SEND_MESSAGES',
            bot_permission: 'SEND_MESSAGES',
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'ascii');
        figlet(args.join(' '), (err, data) => {
            if (err) throw new Error(err.message), console.error(err.stack);
            return message.channel.send(data, { code: 'ascii' }).catch(e => this.client.error(message, 'Please try a shorter message.'));
        });
    };
};

module.exports = Ascii;
