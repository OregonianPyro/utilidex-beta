const Command = require('../../base/command.js');

class LeaveRole extends Command {
    constructor(client) {
        super(client, {
            name: 'leaverole',
            category: 'utility',
            description: 'Takes a role from you from the server\'s public-role list.',
            usage: '{prefix}joinrole [@role|role name|role ID]',
            parameters: 'snowflakeGuildRole',
            extended: true,
            extended_help: 'If you do not know the list of public-roles, simply type `{prefix}joinrole` and a list of roles will be displayed.',
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'SEND_MESSAGES',
            bot_permission: 'MANAGE_ROLES',
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) {
            const array = [];
            let number = 0;
            for (let i = 0; i < message.settings.public_roles.length; i++) {
                number = number + 1;
                array.push(`[${number}] ${message.guild.roles.get(message.settings.public_roles[i]).name}`);
            };
            const msg = await message.channel.send(`Type the number of what role you would like to leave:\`\`\`${array.join('\n')}\`\`\``);
            message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] }).then(async messages => {
                messages.first().delete();
                if (messages.first().content > 0 && messages.first().content <= number) {
                    let role = message.settings.public_roles[messages.first().content - 1];
                    role = message.guild.roles.get(role);
                    if (!role) return msg.edit(`${this.client.emotes.x} Couldn't find that role.`);
                    if (!message.member.roles.has(role.id)) return msg.edit(`${this.client.emotes.x} You do not have the role \`${role.name}\``);
                    try {
                        await message.member.removeRole(role.id);
                    } catch (e) {
                        return msg.edit(`Error: ${e.message}`);
                    };
                    return msg.edit(`${this.client.emotes.check} You no longer have the role \`${role.name}\``);
                };
            }).catch(() => {
                return msg.edit(`${this.client.emotes.x} Timed out.`);
            });
        } else {
            const role = message.mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(args.join(' ').toLowerCase())) || message.guild.roles.get(args[0]);
            if (!role) return message.channel.send(`${this.client.emotes.x} Couldn't find that role.`);
            if (!message.member.roles.has(role.id)) return message.channel.send(`${this.client.emotes.x} You do not have the role \`${role.name}\``);
            try {
                await message.member.removeRole(role.id);
            } catch (e) {
                return msg.edit(`Error: ${e.message}`);
            };
            return message.channel.send(`${this.client.emotes.check} You no longer have the role \`${role.name}\``);
        };
    };
};

module.exports = LeaveRole;