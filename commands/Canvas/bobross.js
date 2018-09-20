const { Attachment } = require('discord.js');
const Command = require('../../base/command.js');

class BobRoss extends Command {
    constructor(client) {
        super(client, {
            name: 'bobross',
            category: 'canvas',
            description: 'Paints a happy accident of a user\'s avatar!',
            usage: '{prefix}bobross [@user|user ID]',
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
        const member = args.length > 0 ? (message.mentions.members.size > 0 || message.guild.members.get(args[0]) ? message.mentions.members.first() || message.guild.members.get(args[0]) : message.memebr) : message.member;
        message.channel.startTyping();
        await message.channel.send(new Attachment(
            await this.client.API.bobRoss(member.user.displayAvatarURL), "bobross.png"));
        return message.channel.stopTyping();
    };
};

module.exports = BobRoss;