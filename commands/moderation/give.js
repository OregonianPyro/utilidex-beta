const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

class Give extends Command {
    constructor(client) {
        super(client, {
            name: 'give',
            category: 'moderation',
            description: 'Gives a user a role.',
            usage: '{prefix}give <@user|user ID> <@role|role name|role ID>',
            parameters: 'snowflakeGuildUser, snowflakeGuildRole',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_ROLES',
            bot_permission: 'MANAGE_ROLES',
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'give');
        const member = message.mentions.members.firs() || message.guild.members.get(args[0]);
        if (!member) return this.client.args(message, 'USER MENTION OR ID');
        const role = message.mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(args.slice(1).join(' ').toLowerCase())) || message.guild.roles.get(args[1]);
        if (!role) return this.client.args(message, 'ROLE MENTION, NAME, OR ID');
        
    };
};

module.exports = Give;