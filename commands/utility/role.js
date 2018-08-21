const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

class Role extends Command {
    constructor(client) {
        super(client, {
            name: 'role',
            category: 'utility',
            description: 'Returns information on a role.',
            usage: '{prefix}role <@role|role name|role ID>',
            parameters: 'snowflakeGuildRole',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'SEND_MESSAGES',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['roleinfo']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'role');
        const str = args.join(' ').toLowerCase();
        const role = message.mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase() === str) || message.guild.roles.find(r => r.name.toLowerCase().includes(str)) || message.guild.roles.get(str);
        if (!role) return this.client.args(this.client, message, 'Please provide a valid role mention, name, or ID.')
        const inRole = role.members.size > 0 ? role.members.map(u => u.user.tag).join(', ') : 'No users to show.';
        const pos = role.calculatedPosition;
        const color = `${role.hexColor} (\`${role.color}\`)`;
        const created = `${this.client.moment(role.createdAt).format('dddd, MMMM Do, YYYY, hh:mm:ss A')} (${this.client.moment(role.createdAt).fromNow()})`;
        const embed = new RichEmbed()
            .setColor(role.hexColor)
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`» Role Information for Role: __**${role.name}**__`)
            .addField('Role Name', role.name, true)
            .addBlankField(true)
            .addField('Role ID', role.id, true)
            .addField('Hoisted', role.hoisted ? this.lient.emotes.check : this.client.emotes.x, true)
            .addBlankField(true)
            .addField('Mentionable', role.mentionable ? this.client.emotes.check : this.client.emotes.x, true)
            .addField('Role Color', color)
            .addField(`Users in Role [${role.members.size}]`, `\`\`\`${inRole}\`\`\``)
            .addField('Created At', created)
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
        return message.delete(), message.channel.send(embed);
    };
};

module.exports = Role;