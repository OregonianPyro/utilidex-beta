const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
const ms = require('ms');

class Slowmode extends Command {
    constructor(client) {
        super(client, {
            name: 'slowmode',
            category: 'moderation',
            description: 'Only allow users to send 1 message every `x` seconds. If you have a staff role set, the bot will ignore uses with that role.',
            usage: '{prefix}slowmode <time|--off>',
            parameters: 'integerTime|stringFlag',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_GUILD',
            bot_permission: 'MANAGE_MESSAGES',
            aliases: ['slow']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'slowmode');
        if (args[0].toLowerCase() === 'off') {
            if (!this.client.slowmode_array.includes(message.channel.id)) return this.client.error(message, 'This channel is not in slowmode.');
            const index = this.client.slowmode_array.indexOf(message.channel.id);
            this.client.slowmode_array.splice(index, 1);
            this.client.slowmode.delete(message.channel.id);
            return message.channel.send(`${this.client.emotes.check} This channel is no longer in slowmode.`);
        } else {
            if (isNaN(parseInt(args[0]))) return this.client.error(message, 'Invalid time provided.');
            if (ms(args[0]) >= ms('3 minutes')) return this.client.error(message, 'Time must be longer than `3 minutes`');
            if (ms(args[0]) <= ms('5 seconds')) return this.client.error(message, 'To prevent possible API spam, time must be above `5 seconds`');
            this.client.slowmode.set(message.channel.id, []);
            this.client.slowmode_array.push(message.channel.id);
            this.client.slowmode_times.set(message.channel.id, ms(args[0]));
            return message.channel.send(`${this.client.emotes.check} Users can now only send one message every \`${ms(ms(args[0]), { long: true})}\``);
        };
    };
};

module.exports = Slowmode;
