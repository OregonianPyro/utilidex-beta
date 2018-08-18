class Ready {
    constructor(client) {
        this.client = client;
        this.chalk = this.client.chalk;
    };

    async run() {
        await this.client.guilds.forEach(g => {
            console.log(this.chalk.bgBlack.green(`Loaded data for '${g.name}' (${g.id})`));
        });
        const time = this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A');
        console.log(this.chalk.bgBlack.greenBright.inverse(`[ READY ] ${this.client.user.tag} has connected on ${time}\``));
    };
};

module.exports = Ready;