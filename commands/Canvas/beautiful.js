const { Attachment } = require('discord.js');
const Command = require('../../base/command.js');

class Beautiful extends Command {
    constructor(client) {
        super(client, {
            name: 'beautiful',
            category: 'canvas',
            description: 'Who\'s beautiful? Let them know with this command.',
            usage: '{prefix}beautiful [@user|user ID]',
            parameters: 'snowflakeGuildMember',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'SEND_MESSAGES',
            bot_permission: 'ATTACH_FILES',
            aliases: []
        });
    };

    async run(message, args) {
        const member = args.length > 0 ? (message.mentions.members.size > 0 || message.guild.members.get(args[0]) ? message.mentions.members.first() || message.guild.members.get(args[0]) : message.memebr) : message.member;
        message.channel.startTyping();
        await message.channel.send(new Attachment(
            await this.client.API.beautiful(member.user.displayAvatarURL), "beautiful.png"));
        return message.channel.stopTyping();
    };
};

module.exports = Beautiful;