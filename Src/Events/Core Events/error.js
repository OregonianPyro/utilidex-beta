module.exports = class {
    constructor(client) {
        this.client = client;
    };

    async run(err) {
        console.log("OOF")
        console.error(err.toString());
    };
};