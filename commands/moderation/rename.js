const Command = require('../../base/command.js');

class Rename extends Command {
    constructor(client) {
        super(client, {
            name: 'rename',
            category: 'moderation',
            description: 'Changes the nickname for a user. If no name is provided, their nickname will be reset.',
            usage: '{prefix}rename <@user|user ID [name]',
            parameters: 'snowflakeGuildMember, stringName',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_NICKNAMES',
            bot_permission: 'MANAGE_NICKNAMES',
            aliases: ['nickname', 'changename', 'name']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'rename');
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return this.client.error(message, 'Please provide a valid user mention or ID.');
        const name = args.slice(1).join(' ').length > 0 ? args.slice(1).join(' ') : member.user.username;
        if (name.length > 32) return message.delete(), this.client.error(message, 'Nicknames cannot be longer than 32 characters.');
        try {
            await member.setNickname(name, `Changed by ${message.author.tag}`);
        } catch (e) {
            return console.error, this.client.error(message, `Error: \`${e.message}\``);
        };
        await message.delete();
        if (name === member.user.username) return message.channel.send(`${this.client.emotes.check} Successfully removed the nickname for \`${member.user.tag}\``);
        return message.channel.send(`${this.client.emotes.check} Successfully updated the nickname for \`${member.user.tag}\``);
    };
};

module.exports = Rename;
