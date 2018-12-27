const Command = require('../../Base/Command.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            category: 'general',
            description: 'Displays statistical information about the bot.',
            usage: '{prefix}stats',
            parameters: 'None',
            extended: false,
            devOnly: false,
            staffOnly: false,
            perms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            aliases: []
        });
    };

    async run(message, args) {
        const [ guilds, users, channels ] = [ this.client.guilds.size, this.client.users.size, this.client.channels.size ];
        const app = await this.client.fetchApplication();
        const online = require('date-fns').distanceInWordsToNow(new Date(), new Date(this.client.readyAt));
        return message.responder.embed({
            authorName: this.client.user.username,
            authorURL: this.client.user.displayAvatarURL(),
            description: `» **Total Commands:** ${this.client.commands.size}\n» **Last Restarted:** ${online} ago\n» **[Support Server](https://discord.gg/yARepUw)**`,
            fields: [{
                name: 'Node Version', value: process.version, inline: true
            }, {
                name: 'Bot Version', value: `v${require('../../../package.json').version}`, inline: true
            }, {
                name: 'Discord.js Version', value: `v${require('discord.js').version}`, inline: true,
            }, {
                name: 'Servers', value: guilds, inline: true
            }, {
                name: 'Channels', value: channels, inline: true
            }, {
                name: 'Users', value: users, inline: true
            }],
            footer: `Utilidex - Developed By ${app.owner.username}`,
            footerURL: app.owner.displayAvatarURL()
        });
    };
};