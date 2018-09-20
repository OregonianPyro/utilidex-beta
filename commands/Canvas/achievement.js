const { Attachment } = require('discord.js');
const Command = require('../../base/command.js');

class Achievement extends Command {
    constructor(client) {
        super(client, {
            name: 'achievement',
            category: 'canvas',
            description: 'Displays an achievement.',
            usage: '{prefix}achievement [@user|user ID] <text>',
            parameters: 'snowflakeGuildMember, stringText',
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
        if (!args[0]) return this.client.help(this.client, message, 'achievement');
        const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
        const text = message.mentions.members.size > 0 || message.guild.members.get(args[0]) ? args.slice(1).join(' ') : (args[0].length === 18 ? args.slice(1).join(' ') : args.join(' '));
        message.channel.startTyping();
        await message.channel.send(new Attachment (
            await this.client.API.achievement(member.user.displayAvatarURL, text), "achievement.png"));
        return message.channel.stopTyping();
    };
};

module.exports = Achievement;