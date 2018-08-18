class RateLimit {
    constructor(client) {
        this.client = client;
        this.chalk = this.client.chalk;
    };

    async run(obj) {
        const time = this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A');
        console.error(this.chalk.bgBlack.whiteBright.inverse(`[ RATE LIMIT ] Rate limit method '${obj.method}' occurred. (Limit: ${obj.limit}\nPath: ${obj.path}\nTime: ${time}`));
    };
};

module.exports = RateLimit;