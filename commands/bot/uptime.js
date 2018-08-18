const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

class Uptime extends Command {
    constructor(client) {
        super(client, {
            name: 'uptime',
            category: 'bot',
            description: 'Displays the bot\'s uptime.',
            usage: '{prefix}uptime',
            parameters: 'None',
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
        const uptime = this.client.moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        const embed = new RichEmbed()
            .setColor(this.client.color)
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
            .setTitle('Bot Uptime')
            .setDescription(`The bot has been online for **${uptime}**`);
        return message.channel.send(embed);
    };
};

module.exports = Uptime;