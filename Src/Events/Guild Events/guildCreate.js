module.exports = class {
    constructor(client) {
        this.client = client;
    };

    async run(guild) {
        if (this.client.store.blacklistedGuilds.includes(guild.id)) {
            console.log(`[ * ] Joined blacklisted guild '${guild.name}' ( ${guild.id} )`);
            return guild.leave();
        };
        this.client.store.guildData.set(guild.id, this.client.defaultGuildData);
        console.log(`[ * ] Joined guld '${guild.name}' ( ${guild.id} )`);
        return this.client.user.setActivity(`${this.client.guilds.size} Servers | u-help`, { type: 'WATCHING' });
    };
};