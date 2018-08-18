class Command {
    constructor(client, {
        name = null,
        category = null,
        description = null,
        usage = null,
        parameters = null,
        extended = false,
        extended_help = null,
        enabled = true,
        reason = null,
        devOnly = false,
        guildOnly = true,
        permission = null,
        bot_permission = null,
        aliases = []
    }) {
        this.client = client;
        this.help = { name, category, description, usage, parameters, extended, extended_help };
        this.conf = { enabled, reason, devOnly, guildOnly, permission, bot_permission, aliases };
    };
};

module.exports = Command;