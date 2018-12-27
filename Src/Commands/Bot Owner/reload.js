const Command = require('../../Base/Command.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            category: 'bot owner',
            description: 'Reloads a command without restarting the bot.',
            usage: '{prefix}reload <command>',
            parameters: 'stringCommand',
            extended: false,
            devOnly: true,
            staffOnly: false,
            perms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) return;
        let [ command, response ] = [ args[0], null ];
        command = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!command) return message.responder.error(`The command \`${command}\` does not exist within the bot.`, true);
        response = await this.client.unloadCommand(command.conf.location, command.help.name);
        if (response) return message.responder.error(`Error Unloading Command: \`${response}\``, true);
        response = await this.client.loadCommand(command.conf.location, command.help.name);
        if (response) return message.responder.error(`Error Loading Command: \`${response}\``, true);
        return message.responder.success(`Successfully reloaded the command \`${command.help.name}\``, true);
    };
};