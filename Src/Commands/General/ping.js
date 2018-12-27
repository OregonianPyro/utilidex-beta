const Command = require('../../Base/Command.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            category: 'general',
            description: 'Runs a connection test to the Discord API.',
            usage: '{prefix}ping',
            parameters: 'None',
            extended: false,
            guildOnly: false,
            devOnly: false,
            supportOnly: false,
            perms: ['SEND_MESSAGES', 'SEND_MESSAGES'],
            aliases: ['p', 'ding']
        });
    };

    async run(message, args) {
        const msg = await message.channel.send('Pinging...');
        let emote;
        const [ latency, ping ] = [ msg.createdTimestamp - message.createdTimestamp, this.client.ws.ping.toFixed() ];
        if (ping < 300) emote = `${this.client.store.emotes.connection.good} Good Connection`;
        if (ping > 301 && ping < 700) `${this.client.store.emotes.connection.slow} Slow Connection`;
        if (ping > 701) `${this.client.store.emotes.bad} Bad Connection`;
        return msg.edit(message.responder.embed({
            color: message.guild.me.displayHexColor,
            authorName: this.client.user.username,
            authorURL: this.client.user.displayAvatarURL(),
            description: `Pong! It took me **${latency}**ms to edit that message.`,
            fields: [{
                name: '💓 Discord Heartbeat', 
                value: `**${ping}**ms`
            }, {
                name: '\u200b',
                value: emote
            }]
        }));
    };
};