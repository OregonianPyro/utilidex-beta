class GuildDelete {
    constructor(client) {
        this.client = client;
    };

    async run(guild) {
        this.client.settings.delete(guild.id);
        this.client.mutes.delete(guild.id);
        console.log(`[ - ] Left Guild '${guild.name}' (${guild.id})`);
    };
};

module.exports = GuildDelete;