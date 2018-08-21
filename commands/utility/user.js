const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

class User extends Command {
    constructor(client) {
        super(client, {
            name: 'user',
            category: 'utility',
            description: 'Returns information for a user in the server.',
            usage: '{prefix}user [@user|user ID]',
            parameters: 'snowflakeGuildMember',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'SEND_MESSAGES',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['userinfo']
        });
    };

    async run(message, args) {
        let member;
        if (!args[0]) member = message.member;
        if (args[0]) member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
        let status;
        if (member.user.presence.status === 'online') status = '<:utilidexOnline:466475765207138315> **ONLINE**';
        if (member.user.presence.status === 'idle') status = '<:utilidexIdle:466475764087521292> **IDLE**';
        if (member.user.presence.status === 'dnd') status = '<:utilidexDND:466475824359407626> **DND**';
        if (member.user.presence.status === 'offline') status = '<:utilidexOffline:466475764418871298> **OFFLINE**';
        const joined = {
            discord: `${this.client.moment(member.user.createdAt).format('dddd, MMMM Do, YYYY, hh:mm:ss A')} (${this.client.moment(member.user.createdAt).fromNow()})`,
            guild: `${this.client.moment(member.joineddAt).format('dddd, MMMM Do, YYYY, hh:mm:ss A')} (${this.client.moment(member.joinedAt).fromNow()})`
        };
        const highest_role = member.roles.size > 1 ? member.highestRole.name : 'No Highest Role';
        const embed = new RichEmbed()
            .setColor(this.client.color)
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .setDescription(`» Status: ${status}\n» Nickname: ${member.nickname ? `**__${member.nickname}__**` : 'No Nickname'}`)
            .addField('Username', member.user.tag, true)
            .addField('User ID', member.user.id, true)
            .addField('Joined Discord On', joined.discord)
            .addField('Joined the Server On', joined.guild)
            .addField(`Roles [${member.roles.size - 1}]`, member.roles.size > 1 ? `${member.roles.map(r => r.toString()).slice(1).join(' | ')}\n\nHighest Role: __**${highest_role}**__` : 'No Roles')
            .setThumbnail(member.user.displayAvatarURL)
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL);
        return message.channel.send(embed);
    };
};

module.exports = User;
