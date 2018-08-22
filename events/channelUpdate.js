const { RichEmbed } = require('discord.js');
/*
Server-log event that triggeres whenever a channel is updated.
*/

class ChannelUpdate {
    constructor(client) {
        this.client = client;
    };
    /**
     * @param {object} channel The channel object of the newly edited channel.
     */
    async run(oldChannel, newChannel) {
        if (!this.client.settings.get(newChannel.guild.id).logging.serverlog.enabled) return;
        const serverlog = newChannel.guild.channels.find(c => c.name === this.client.settings.get(newChannel.guild.id).logging.serverlog.channel) || newChannel.guild.channels.get(this.client.settings.get(newChannel.guild.id).logging.serverlog.channel);
        if (!serverlog) return;
        if (!newChannel.guild.me.permissions.has('VIEW_AUDIT_LOG')) throw new Error(`Cannot view audit logs in '${newChannel.guild.name}'`);
        const audit = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE' }).then(a => a.entries.first());
        const executor = `${audit.executor.username}#${audit.executor.discriminator}`;
        const target = {
            name: audit.target.name,
            ID: audit.target.id,
            type: audit.target.type
        };
        if (audit.changes[0].key === 'name') {
            const changes = {
                old_name: audit.changes[0].old,
                new_name: audit.changes[0].new
            };
            const embed = new RichEmbed()
                .setAuthor(newChannel.guild.name, newChannel.guild.iconURL)
                .setTitle('Channel Updated')
                .setDescription(`\`${executor}\` edited the \`${target.type}\` channel '\`${changes.new_name}\`'`)
                .setFooter('Action: NAME CHANGE')
                .addField('Old Name', changes.old_name, true)
                .addField('New Name', changes.new_name, true)
                .addField('ID', target.ID, true)
                .setColor('GOLD');
            return serverlog.send(embed);
        } else if (audit.changes[0].key === 'topic') {
            const changes = {
                old_topic: audit.changes[0].old === '' ? 'No Previous Topic' : audit.changes[0].old,
                new_topic: audit.changes[0].new === '' ? 'No New Topic' : audit.changes[0].new
            };
            const embed = new RichEmbed()
                .setAuthor(newChannel.guild.name, newChannel.guild.iconURL)
                .setTitle('Channel Updated')
                .setDescription(`\`${executor}\` edited the \`${target.type}\` channel '\`${target.name}\`'`)
                .setFooter('Action: TOPIC CHANGE')
                .addField('Old Topic', changes.old_topic, true)
                .addField('New Topic', changes.new_topic, true)
                .addField('ID', target.ID, true)
                .setColor('GOLD');
            return serverlog.send(embed);
        } else if (audit.changes[0].key === 'nsfw') {
            const changes = {
                old: audit.changes[0].old,
                new: audit.changes[0].new
            };
            const embed = new RichEmbed()
                .setAuthor(newChannel.guild.name, newChannel.guild.iconURL)
                .setTitle('Channel Updated')
                .setDescription(`\`${executor}\` edited the \`${target.type}\` channel '\`${target.name}\`'`)
                .setFooter('Action: NSFW CHANGE')
                .addField('Previously NSFW', changes.old, true)
                .addField('Currently NSFW', changes.new, true)
                .addField('ID', target.ID, true)
                .setColor('GOLD');
            return serverlog.send(embed);
        };
    };
};

module.exports = ChannelUpdate;
