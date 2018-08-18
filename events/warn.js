class Warn {
    constructor(client) {
        this.client = client;
        this.chalk = this.client.chalk;
    };

    async run(info) {
        console.error(this.chalk.bgBlack.yellowBright.inverse(`[ WARN ] ${info}`));
    };
};

module.exports = Warn;