const { Attachment } = require('discord.js');
const Command = require('../../base/command.js');

class Blame extends Command {
    constructor(client) {
        super(client, {
            name: 'blame',
            category: 'canvas',
            description: 'Blames someone like they deserve it.',
            usage: '{prefix}blame <text|@user|user ID>',
            parameters: 'stringText | snowflakeGuildMember',
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
        if (!args[0]) return this.client.help(this.client, message, 'blame');
        const text = message.mentions.members.size > 0 || message.guild.members.get(args[0]) ? ( message.mentions.members.size > 0 ? message.mentions.members.first().user.tag : message.guild.members.get(args[0].user.tag)) : ( args[0].length === 18 && !isNaN(parseInt(args[0])) ? args.slice(1).join(' ') : args.join(' ')); 
        message.channel.startTyping();
        await message.channel.send(new Attachment(
            await this.client.API.blame(text, 'blame.png')
        ));
        return message.channel.stopTyping();
    };
};

module.exports = Blame;