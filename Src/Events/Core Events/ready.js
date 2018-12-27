module.exports = class {
    constructor(client) {
        this.client = client;
        this.chalk = require('chalk');
    };

    async run() {
        this.client.user.setActivity(`${this.client.guilds.size} Servers | u!help`, { type: 'WATCHING' });
        const { table } = require('table');
        const data = [['Guild Name', 'Members', 'ID']];
        await this.client.guilds.forEach(g => {
            data.push([g.name, g.members.size, g.id]);
        });
        console.log(this.chalk.bgGreen(`Loaded ${this.client.commands.size} Commands`));
        console.log(table(data));
        console.log(this.chalk.bgBlack.greenBright.inverse(`[ READY ] ${this.client.user.tag} has connected to Discord successfully.\``));
        this.client.ready = true;
    };
};