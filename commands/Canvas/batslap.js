const { Attachment } = require('discord.js');
const Command = require('../../base/command.js');

class BatSlap extends Command {
    constructor(client) {
        super(client, {
            name: 'batslap',
            category: 'canvas',
            description: 'Slaps someone that truly deserves a nice slap.',
            usage: '{prefix}batslap <@user|user ID>',
            parameters: 'snowflakeGuildMember',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: true,
            guildOnly: true,
            permission: 'SEND_MESSAGES',
            bot_permission: 'ATTACH_FILES',
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'batslap');
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return this.client.error(message, 'No valid user mention or ID was provided.');
        if (member.user.id === message.author.id) return message.channel.send(`${message.author} | Really, you're gonna slap yourself? Although you deserve it for trying, I will not allow it.`);
        message.channel.startTyping();
        await message.channel.send(new Attachment(
            await this.client.API.batSlap(message.author.displayAvatarURL, member.user.displayAvatarURL), "get-slapped.png"));
        return message.channel.stopTyping();
    };
};

module.exports = BatSlap;