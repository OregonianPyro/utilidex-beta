module.exports = class Command {
    constructor(client, {
        name = null,
        category = null,
        description = null,
        usage = null,
        parameters = null,
        extended = false,
        guildOnly = false,
        devOnly = true,
        staffOnly = false,
        //userPerm, botPerm, permNode
        perms = [null, null, null],
        aliases = []
    }) {
        this.client = client;
        this.help = { name, category, description, usage, parameters, extended };
        this.conf = { guildOnly, devOnly, perms, aliases };
    };
};