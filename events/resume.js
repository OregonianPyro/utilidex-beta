class Resume {
    constructor(client) {
        this.client = client;
        this.chalk = this.client.chalk;
    };

    async run(replayed) {
        const time = this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A');
        console.log(this.chalk.bgBlack.green.inverse(`[ RESUME ] ${this.client.user.tag} resumed connection on ${time} | Replayed ${replayed} events.`));
    };
};

module.exports = Resume;