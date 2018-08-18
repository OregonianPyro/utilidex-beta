class Disconnect {
    constructor(client) {
        this.client = client;
        this.chalk = this.client.chalk;
    };

    async run() {
        const time = this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A');
        console.error(this.chalk.bgBlack.redBright.inverse(`[ DISCONNECT ] ${this.client.user.tag} has disconnected on ${time}`));
    };
};

module.exports = Disconnect;