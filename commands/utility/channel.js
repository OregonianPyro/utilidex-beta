const Command = require('../../base/command.js');
const { RichEmbed, Util } = require('discord.js');

class Channel extends Command {
    constructor(client) {
        super(client, {
            name: 'channel',
            category: 'utility',
            description: 'Retrieves information on a channel in the server.',
            usage: '{prefix}channel [#channel|channel name|channel ID]',
            parameters: 'snowflakeGuildChannel',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'SEND_MESSAGES',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['channelinfo', 'ch']
        });
    };
    
    async run(message, args) {
        let channel;
        if (!args[0]) channel = message.channel;
        if (args[0]) channel = message.mentions.channels.first() || message.guild.channels.find('name', args.join(' ')) || message.guild.channels.get(args[0]);
        if (!channel) channel = message.channel;
        let obj;
        const embed = new RichEmbed()
            .setColor(this.client.color)
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL);
        if (channel.type === 'text') {
            obj = {
                name: channel.name,
                id: channel.id,
                nsfw: channel.nsfw ? this.client.emotes.check : this.client.emotes.x,
                topic: channel.topic ? `\`\`\`${Util.escapeMarkdown(channel.topic, false, true)}\`\`\`` : '```\n\n```',
                position: channel.calculatedPosition,
                created: `${this.client.moment(channel.createdAt).format('dddd, MMMM Do, YYYY, hh:mm:ss A')} (${this.client.moment(channel.createdAt).fromNow()})`,
                parent_name: channel.parent.name
            };
            embed.addField('Name', obj.name, true);
            embed.addField('Position', obj.position, true);
            embed.addField('ID', obj.id, true);
            embed.addField('Topic', obj.topic);
            embed.addField('NSFW', obj.nsfw, true);
            embed.addField('Category Name', obj.parent_name, true);
            embed.setDescription(`» Created On: **${obj.created}**\n» Type: __text__`);
            return message.channel.send(embed);
        } else if (channel.type === 'voice') {
            obj = {
                name: channel.name, 
                id: channel.id,
                position: channel.calculatedPosition,
                created: `${this.client.moment(channel.createdAt).format('dddd, MMMM Do, YYYY, hh:mm:ss A')} (${this.client.moment(channel.createdAt).fromNow()})`,
                bitrate: channel.bitrate,
                full: channel.full ? this.client.emotes.check : this.client.emotes.x,
                limit: channel.userLimit
            };
            embed.addField('Name', obj.name, true);
            embed.addField('Position', obj.position, true);
            embed.addField('ID', obj.id, true);
            embed.addField('Bitrate', obj.bitrate, true)
            embed.addField('Full', obj.full, true)
            embed.addField('User Limit', obj.limit, true)
            embed.setDescription(`» Created On: **${obj.created}**\n» Type: __voice__`);
            return message.channel.send(embed);
        } else if (channel.type === 'category') {
            obj = {
                name: channel.name,
                id: channel.id,
                position: channel.calculatedPosition,
                created: `${this.client.moment(channel.createdAt).format('dddd, MMMM Do, YYYY, hh:mm:ss A')} (${this.client.moment(channel.createdAt).fromNow()})`,
                children: channel.children.map(c => c.toString()).join('\n')    
            };
            embed.addField('Name', obj.name, true);
            embed.addField('Position', obj.position, true);
            embed.addField('ID', obj.id, true);
            embed.addField(`Children [${channel.children.size}]`, obj.children, true)
            embed.setDescription(`» Created On: **${obj.created}**\n» Type: __category__`);
            return message.channel.send(embed);
        };
    };
};

module.exports = Channel;
