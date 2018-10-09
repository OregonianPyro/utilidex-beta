const Command = require('../../base/command.js');

class Trigger extends Command {
    constructor(client) {
        super(client, {
            name: 'trigger',
            category: 'administrator',
            description: 'Manages the server\'s custom triggers.',
            usage: '{prefix}trigger --<add|view|edit|rename|remove> ["trigger"] ["response"] [--tlc] [--match]',
            parameters: 'stringFlag, stringTrigger, stringResponse, booleanTLC, booleanMatch',
            extended: true,
            extended_help: 'By adding the `--tlc` flag at the end, it will check if the message content (to lowercase) matches the trigger (to lowercase) making it case insensitive.\nBy adding the `--match` flag at the end, it will check if the message is __only__ the trigger.',
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
        if (!args[0]) return this.client.help(this.client, message, 'trigger');
        if (!args[0].includes('--')) return;
        const flag = args[0].split('--')[1].toLowerCase();
        if (flag === 'add') {
            console.log(args[1]);
            if (!args[1] || !args[1].includes('"')) return this.client.error(message, 'Please provide a trigger. The trigger should be inside `" "`');
            const trigger = message.content.split('"')[1];
            const response = message.content.split('"')[3];
            if (!response || response.length < 1) return this.client.error(message, 'Please provide a response. The response should be within `" "`');
            const exists = await this.triggerExists(message, trigger);
            if (exists) return this.client.error(message, 'This tag already exists.');
            this.client.triggers.push(message.guild.id, { trigger: trigger, response: response });
            return message.channel.send(`${this.client.emotes.check} Successfully added the trigger \`${trigger}\``);
        } else if (flag === 'view') {
            const result = [];
            for (let i = 0; i < this.client.triggers.get(message.guild.id).length; i++) {
                result.push(`${this.client.triggers.get(message.guild.id)[i].trigger} :: ${this.client.triggers.get(message.guild.id)[i].response}`);
            };
            if (!result || result.length < 0) return message.channel.send(`No triggers found for \`${message.guild.name}\``);
            const splitOptions = {
                maxLength: 1950,
                char: '\n',
                prepend: '```',
                append: '```'
            };
            return message.channel.send(`Found \`${this.client.triggers.get(message.guild.id).length}\` ${this.client.triggers.get(message.guild.id).length === 1 ? 'Trigger' : 'Triggers'} for ${message.guild.name}\`\`\`${result.join('\n')}\`\`\``, { split: splitOptions });
        } else if (['rem', 'remove', 'del', 'delete'].includes(flag)) {
            if (!args[1] || !args[1].includes('"')) return this.client.error(message, 'Please provide a trigger. The trigger should be inside `" "`');
            const trigger = message.content.split('"')[1];
            const exists = await this.triggerExists(message, trigger);
            console.log(exists);
            if (!exists) return this.client.error(message, 'That trigger does not exist.');
            this.client.triggers.get(message.guild.id).splice(await this.index(trigger, message), 1);
            this.client.triggers.set(message.guild.id, this.client.triggers.get(message.guild.id));
            return message.channel.send(`${this.client.emotes.check} Successfully removed the trigger \`${trigger}\``);
        };
    };
    /*
    example trigger object
    {
        trigger: "my name rey",
        response: "rey big gey",
    };
    */
    async triggerExists(message, trigger) {
        let res = false;
        for (let i = 0; i < message.client.triggers.get(message.guild.id).length; i++) {
            if (message.client.triggers.get(message.guild.id)[i].trigger === trigger) return res = true;
        };
        return res;
    };

    index(key, message) {
        let position;
        for (let i = 0; i < message.client.triggers.get(message.guild.id).length; i++) {
            if (message.client.triggers.get(message.guild.id)[i].trigger === key) return i = position;
        };
        return position;
    };
};

module.exports = Trigger;
