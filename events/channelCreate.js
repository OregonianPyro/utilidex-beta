const { RichEmbed } = require('discord.js');
/*
Server-log event that triggeres whenever a new channel is created.
*/

class ChannelCreate {
    constructor(client) {
        this.client = client;
    };
    /**
     * @param {object} channel The channel object of the newly created object.
     */
    async run(channel) {
        if (!this.client.settings.get(channel.guild.id).logging.serverlog.enabled) return;
        const serverlog = channel.guild.channels.find(c => c.name === this.client.settings.get(channel.guild.id).logging.serverlog.channel) || channel.guild.channels.get(this.client.settings.get(channel.guild.id).logging.serverlog.channel);
        if (!serverlog) return;
        if (!channel.guild.me.permissions.has('VIEW_AUDIT_LOG')) throw new Error(`Cannot view audit logs in '${channel.guild.name}'`);
        const audit = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' }).then(a => a.entries.first());
        const embed = new RichEmbed()
            .setColor('GREEN')
            .setAuthor(channel.guild.name, channel.guild.iconURL)
            .setTitle('Channel Created')
            .setDescription(`\`${audit.executor.username}#${audit.executor.discriminator}\` created the \`${audit.target.type}\` channel '\`${audit.target.name}\`'`)
            .addField('Name', audit.target.name, true)
            .addField('Type', audit.target.type === 'text' ? 'Text' : 'Voice', true)
            .addField('ID', audit.target.id, true)
            .setTimestamp();
        return serverlog.send(embed);
    };
};

module.exports = ChannelCreate;