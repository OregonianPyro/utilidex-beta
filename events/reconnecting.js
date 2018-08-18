class Reconnecting {
    constructor(client) {
        this.client = client;
        this.chalk = this.client.chalk;
    };

    async run() {
        const time = this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A');
        console.error(this.chalk.bgBlack.yellowBright.inverse(`[ RECONNECTING ] ${this.client.user.tag} is attempting to reconnect on ${time}`));
    };
};

module.exports = Reconnecting;