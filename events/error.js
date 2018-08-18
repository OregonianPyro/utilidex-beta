class Error {
    constructor(client) {
        this.client = client;
        this.chalk = this.client.chalk;
    };

    async run(data) {
        return console.error(this.chalk.bgRed.whiteBright(data));
    };
};

module.exports = Error;