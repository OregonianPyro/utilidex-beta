module.exports = class {
    constructor(client) {
        this.client = client;
        this.chalk = require('chalk');
    };

    async run(guild) {
        if (this.client.store.guildData.has(guild.id)) this.client.store.guildData.delete(guild.id);
        console.log(this.chalk.bgRed(` [ --> ] Left Guild '${guild.name}' ( ${guild.id} )`));
    };
};