const { RichEmbed } = require('discord.js');
/*
Server-log event that triggeres whenever a new channel is deleted.
*/

class ChannelDelete {
    constructor(client) {
        this.client = client;
    };
    /**
     * @param {object} channel The channel object of the newly deleted channel.
     */
    async run(channel) {
        if (!this.client.settings.get(channel.guild.id).logging.serverlog.enabled) return;
        const serverlog = channel.guild.channels.find(c => c.name === this.client.settings.get(channel.guild.id).logging.serverlog.channel) || channel.guild.channels.get(this.client.settings.get(channel.guild.id).logging.serverlog.channel);
        if (!serverlog) return;
        if (!channel.guild.me.permissions.has('VIEW_AUDIT_LOG')) throw new Error(`Cannot view audit logs in '${channel.guild.name}'`);
        const audit = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then(a => a.entries.first());
        const embed = new RichEmbed()
            .setColor('RED')
            .setAuthor(channel.guild.name, channel.guild.iconURL)
            .setTitle('Channel Deleted')
            .setDescription(`\`${audit.executor.username}#${audit.executor.discriminator}\` deleted the \`${channel.type}\` channel '\`${channel.name}\`'`)
            .addField('Name', channel.name, true)
            .addField('Type', channel.type === 'text' ? 'Text' : 'Voice', true)
            .addField('ID', channel.id, true)
            .setTimestamp();
        return serverlog.send(embed);
    };
};

module.exports = ChannelDelete;