const BaseCommand = require('../../base/command.js');

class Command extends BaseCommand {
    constructor(client) {
        super(client, {
            name: 'command',
            category: 'administrative',
            description: 'Disable or enable commands within your server.',
            usage: '{prefix}command <enable|view|disable> [command name]',
            parameters: 'stringFlag, stringCommandName',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_GUILD',
            bot_permission: 'SEND_MESSAGES',
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'command');
        if (!['enable', 'view', 'disable'].includes(args[0].toLowerCase())) return this.client.error(message, 'Invalid option. Valid options: `enable`, `view`, `disable`.');
        const flag = args[0].toLowerCase();
        if (flag === 'enable') {
            if (!args[1]) return this.client.error(message, 'You must provide the name of the command you want to enable.');
            const command = args[1].toLowerCase();
            if (!message.settings.disabled_commands.includes(command)) return this.client.error(message, 'That command is not disabled on this server.');
            message.settings.disabled_commands.remove(command);
            this.client.settings.set(message.guild.id, message.settings);
            return message.channel.send(`${this.client.emotes.check} Successfully enabled the command \`${command}\``);
        } else if (flag === 'view') {
            let counter = 0;
            let result = [];
            for (let i = 0; i < message.settings.disabled_commands.length; i++) {
                ++counter;
                result.push(`[${counter}] ${message.settings.disabled_commands[i]}`);
            };
            if (!result || result.length < 1) return message.channel.send(`There are no disabled commands for ${message.guild.name}`);
            const options = { maxLength: 1950, char: '\n', prepend: '```', append: '```' };
            return message.channel.send(`Found \`${result.length}\` Disabled Command${result.length === 1 ? '' : 's'} for ${message.guild.name}\`\`\`${result.join('\n')}\`\`\``, { split: options });
        } else if (flag === 'disable') {
            if (!args[1]) return this.client.error(message, 'You must provide the name of the command you want to disavble.');
            const command = args[1].toLowerCase();
            if (message.settings.disabled_commands.includes(command)) return this.client.error(message, 'That command is already disabled on this server.');
            if(['command', 'settings', 'ping', 'help'].includes(command)) return this.client.error(message, 'You cannot disable a core command of the bot.');
            const botCommands = [];
            this.client.commands.forEach(i => {
                botCommands.push(i.help.name);
            });
            if (!botCommands.includes(command)) return this.client.error(message, 'That command is not apart of the bot.');
            message.settings.disabled_commands.push(command);
            this.client.settings.set(message.guild.id, message.settings);
            return message.channel.send(`${this.client.emotes.check} Successfully disabled the command \`${command}\``);
        };
    };
};

module.exports = Command;
