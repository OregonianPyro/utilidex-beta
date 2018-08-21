const Command = require('../../base/command.js');

class Reload extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            category: 'developer',
            description: 'Reloads a command.',
            usage: '{prefix}relaod <command>',
            parameters: 'stringCommand',
            extended: false,
            enabled: true,
            reason: null,
            permission: 'ADMINISTRATOR',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['r']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'reload');
        let command = args[0].toLowerCase();
        command = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!command) return message.channel.send(`${this.client.emotes.x} The command \`${args[0]}\` does not exist, nor is it an alias.`);
        let response = await this.client.unloadCommand(command.conf.location, command.help.name);
        if (response) return message.channel.send(`${this.client.emotes.x} Error Unloading: \`${response}\``);
        response = this.client.loadCommand(command.conf.location, command.help.name);
        if (response) return message.channel.send(`${this.client.emotes.x} Error Loading: \`${response}\``);
        return message.channel.send(`${this.client.emotes.check} Successfully reloaded the command \`${command.help.name}\``);
    };
};

module.exports = Reload;