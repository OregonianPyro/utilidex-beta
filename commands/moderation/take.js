const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

class Take extends Command {
    constructor(client) {
        super(client, {
            name: 'take',
            category: 'moderation',
            description: 'Removes a role from a user.',
            usage: '{prefix}take <@user|user ID> <@role|role name|role ID>',
            parameters: 'snowflakeGuildUser, snowflakeGuildRole',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_ROLES',
            bot_permission: 'MANAGE_ROLES',
            aliases: ['removerole']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'take');
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return this.client.args(message, 'USER MENTION OR ID');
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition) {
            return this.client.error(message, 'That user has a role that is above the bot\'s highest role and cannot be moderated.');
        };
        if (!args[1]) return this.client.args(message, 'ROLE MENTION, NAME, OR ID');
        const role = message.mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(args.slice(1).join(' ').toLowerCase())) || message.guild.roles.get(args[1]);
        if (!role) return this.client.args(message, 'ROLE MENTION, NAME, OR ID');
        if (role.calculatedPosition >= message.guild.me.highestRole.calculatedPosition) {
            return this.client.error(message, 'That role cannot be removed as it is higher than the bot\'s highest role.');
        };
        if (!member.roles.has(role.id)) {
            return this.client.error(message, 'That user does not have that role.');
        };
        try {
            await member.removeRole(role, `Removed by ${message.author.tag}`);
        } catch (e) {
            return this.client.error(message, e.message);
        };
        const embed = new RichEmbed()
            .setColor('GREEN')
            .setDescription(`${this.client.emotes.check} ${message.author.tag} removed the role \`${role.name}\` from **${member.user.tag}**`);
        message.delete(), message.channel.send(embed);
        if (!message.settings.logging.rolelog.enabled) return;
        if (!message.guild.channels.get(message.settings.logging.rolelog.channel)) return;
        const role_log = new RichEmbed()
            .setColor('RED')
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was removed from the role \`${role.name}\` by ${message.author.tag}`)
            .setFooter(`Moderator: ${message.author.tag} | ${this.client.moment().format('LLLL')}`, message.author.displayAvatarURL);
        return message.guild.channels.get(message.settings.logging.rolelog.channel).send(role_log);
    };
};

module.exports = Take;
