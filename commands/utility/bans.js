const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

class Bans extends Command {
    constructor(client) {
        super(client, {
            name: 'bans',
            category: 'utility',
            description: 'Fetches all of the users currently banned on the server.',
            usage: '{prefix}bans',
            parameters: 'None',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'SEND_MESSAGES',
            bot_permission: 'BAN_MEMBERS',
            aliases: []
        });
    };

    async run(message, args) {
        const bans = await message.guild.fetchBans();
        if (bans.size < 1) return message.channel.send(`${this.client.emotes.x} This server does not have any bans recorded.`);
        const map = bans.map(u => `${u.tag}\n» User ID: ${u.id}`).join('\n');
        const embed = new RichEmbed()
            .setColor(this.client.color)
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`Fetched \`${bans.size}\` bans for ${message.guild.name}\n\`\`\`${map}\`\`\``);
        return message.channel.send(embed);
    };
};

module.exports = Bans;
