const Enmap = require('enmap');

module.exports = {
    guildData: new Enmap({ name: 'guild-data' }),
    permNodes: new Enmap({ name: 'permNodes' }),
    tags: new Enmap({ name: 'tags' }),
    triggers: new Enmap({ name: 'triggers' }),
    clientSettings: new Enmap({ name: 'client-settings'}),
    emotes: {
        check: '<:utilidexPass:454452324413210624>',
        x: '<:utilidexFail:454452324455284738>',
        warn: '<:utilidexWarning:454452324807475222>',
        connection: {
            good: '<:utilidexGoodConnection:498224953863307274>',
            slow: '<:utilidexSlowConnection:498224954072891421>',
            bad: '<:utilidexBadConnection:498224953439813662>'
        }
    },
    supportStaff: [],
    disabledCommands: [],
    blacklistedGuilds: [],
    blacklistedUsers: []
};

//this.client.store.guildSettings.get(message.guild.id, 'prefix');
//this.client.store.emotes.x;
//this.client.store.emotes.connection.slow;