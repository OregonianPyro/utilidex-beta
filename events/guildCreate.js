class GuildCreate {
    constructor(client) {
        this.client = client;
    };

    async run(guild) {
        this.client.settings.set(guild.id, this.client.default_settings);
        this.client.mutes.set(guild.id, []);
        guild.members.forEach(m => {
            this.client.mod_history.set(`${guild.id}-${m.id}`, []);
            this.client.spam.set(`${guild.id}-${m.id}`, 0);
        });
        this.client.custom_commands.set(guild.id, []);
        this.client.cases.set(guild.id, 0);
        console.log(`[ + ] Joined Guild '${guild.name}' (${guild.id})`);
    };
};

module.exports = GuildCreate;