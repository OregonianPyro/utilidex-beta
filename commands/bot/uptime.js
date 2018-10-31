const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
const { parse, format, distanceInWordsToNow  } = require('date-fns');

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
        let uptime = format(new Date(this.client.readyAt), 'dddd, MMMM do, YYYY, hh:mm:ss A');
        let restarted = distanceInWordsToNow(new Date(this.client.readyAt), new Date());
        const embed = new RichEmbed()
            .setColor(this.client.color)
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
            .setTitle('Bot Uptime')
            .setDescription(`The bot has been online since **${uptime}**\n» Last Restarted: ${restarted} ago`);
        return message.channel.send(embed);
    };
};

module.exports = Uptime;
