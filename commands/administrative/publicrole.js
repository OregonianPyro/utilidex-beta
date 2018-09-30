const Command = require('../../base/command.js');

class PublicRole extends Command {
    constructor(client) {
        super(client, {
            name: 'publicrole',
            category: 'admin',
            description: 'Add or remove roles from your public-role list, or view your current public-roles.',
            usage: '{prefix}publicrole --<add|view|remove> [@role|role name|role ID]',
            parameters: 'stringFlag, snowflakeGuildRole',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_ROLES',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['pr', 'joinroles']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'publicrole');
        const flag = message.content.split('--')[1].split(' ')[0].toLowerCase();
        const filter = m => m.author.id === message.author.id;
        const obj = { max: 1, time: 60000, errors: ['time'] };
        if (flag === 'add') {
            if (!args[1]) {
                const msg = await message.channel.send('```What role do you want to be added? Provide a valid role mention, name, or ID.```:stopwatch: This menu will time out after one minute.');
                message.channel.awaitMessages(filter, obj).then(msgs => {
                    msgs.first().delete();
                    let role = msgs.first().mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.roles.get((msgs.first().content));
                    if (!role) return msg.edit(`${this.client.emotes.x} No valid role mention, name, or ID was provided.`);
                    if (message.settings.public_roles.includes(role.id)) return msg.edit(`${this.client.emotes.x} That role is already apart of your public roles list.`);
                    if (message.settings.public_roles.length >= 50) return msg.edit(`${this.client.emotes.x} You cannot add anymore roles as you have reached the maxmimum roles allowed (50)`);
                    this.client.settings.push(message.guild.id, role.id, 'public_roles', false);
                    return msg.edit(`${this.client.emotes.check} Successfully added the role \`${role.name}\` to your public-role list.`);
                }).catch((e) => {
                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                });
            } else {
                const role = message.mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(args.slice(1).join(' ').toLowerCase())) || message.guild.roles.get(args[1]);
                if (!role) return this.client.error(message, 'No valid role mention, name, or ID was provided.');
                if (message.settings.public_roles.includes(role.id)) return message.channel.send(`${this.client.emotes.x} That role is already apart of your public roles list.`);
                if (message.settings.public_roles.length >= 50) return message.channel.send(`${this.client.emotes.x} You cannot add anymore roles as you have reached the maxmimum roles allowed (50)`);
                this.client.settings.push(message.guild.id, role.id, 'public_roles', false);
                return message.channel.send(`${this.client.emotes.check} Successfully added the role \`${role.name}\` to your public-role list.`);
            };
        } else if (['rem', 'remove', 'del', 'delete'].includes(flag)) {
            if (!args[1]) {
                const msg = await message.channel.send('```What role do you want to be removed? Provide a valid role mention, name, or ID.```:stopwatch: This menu will time out after one minute.');
                message.channel.awaitMessages(filter, obj).then(msgs => {
                    msgs.first().delete();
                    let role = msgs.first().mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.roles.get((msgs.first().content));
                    if (!role) return msg.edit(`${this.client.emotes.x} No valid role mention, name, or ID was provided.`);
                    if (!message.settings.public_roles.includes(role.id)) return msg.edit(`${this.client.emotes.x} That role is not apart of your public roles list.`);
                    message.settings.public_roles.splice(message.settings.public_roles.indexOf(role.id), 1);
                    this.client.settings.set(message.guild.id, message.settings);
                    return msg.edit(`${this.client.emotes.check} Successfully removed the role \`${role.name}\` from your public-role list.`);
                }).catch((e) => {
                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                });
            } else {
                const role = message.mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(args.slice(1).join(' ').toLowerCase())) || message.guild.roles.get(args[1]);
                if (!role) return this.client.error(message, 'No valid role mention, name, or ID was provided.');
                if (!message.settings.public_roles.includes(role.id)) return message.channel.send(`${this.client.emotes.x} That role is not apart of your public roles list.`);
                message.settings.public_roles.splice(message.settings.public_roles.indexOf(role.id), 1);
                this.client.settings.set(message.guild.id, message.settings);
                return message.channel.send(`${this.client.emotes.check} Successfully removed the role \`${role.name}\` from your public-role list.`);
            };
        } else if (['view', 'list'].includes(flag)) {
            const names = [];
            let number = 0;
            for (let i = 0; i < message.settings.public_roles.length; i++) {
                number = number + 1;
                let role = message.guild.roles.get(message.settings.public_roles[i]);
                names.push(`[${number}] ${role.name}`);
            };
            const opts = {
                maxLength: 1950,
                char: '\n',
                prepend: '```',
                append: '```'
            };
            return message.channel.send(`Found \`${message.settings.public_roles.length}\` Public ${message.settings.public_roles.length === 1 ? 'Role': 'Roles'} for ${message.guild.name}:\`\`\`${names.join('\n')}\`\`\``, { split: opts });
        } else {
            return message.channel.send(`${this.client.emotes.x} Invalid flag. Valid flags: \`add\`, \`view\`, \`remove\``);
        };
    };
};

module.exports = PublicRole;