const Command = require('../../base/command.js');

class StickyRole extends Command {
    constructor(client) {
        super(client, {
            name: 'stickyrole',
            category: 'moderation',
            description: 'Assign or remove roles that persist to a user even if they leave and rejoin.',
            usage: '{prefix}stickyrole --<add|view|remove> [@user|user ID] [@role|role name|role ID]',
            parameters: 'stringFlag, snowflakeGuildMember, snowflakeGuildRole',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_ROLES',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['sr', 'rolepersist', 'persistrole', 'permroles']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'stickyrole');
        if (!args[0].includes('--')) return;
        const flag = args[0].split('--')[1].toLowerCase();
        if (flag === 'add') {
            if (!args[1]) return this.client.error(message, 'You must provide a valid user mention or ID.');
            if (!args[2]) return this.client.error(message, 'You must provide a valid role mention, name, or ID.');
            const member = message.mentions.members.first() || message.guild.members.get(args[1]);
            if (!member) return this.client.error(message, 'You must provide a valid user mention or ID.');
            const role = message.mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(args.slice(2).join(' ').toLowerCase())) || message.guild.roles.get(args[2]);
            if (!role) return this.client.error(message, 'You must provide a valid role mention, name, or ID.');
            if (this.client.stickyRoles.get(message.guild.id).includes(`${member.user.id}-${role.id}`)) {
                return this.client.error(message, `\`${member.user.tag}\` already has the role \`${role.name}\` assigned to them as a sticky role.`);
            };
            this.client.stickyRoles.push(message.guild.id, `${member.user.id}-${role.id}`);
            try {
                await member.addRole(role.id, 'Adding Sticky-Roles');
            } catch (e) {
                return this.client.error(message, `Error adding their role: \`${e.message}\``);
            };
            return message.channel.send(`${this.client.emotes.check} \`${member.user.tag}\` now has the role \`${role.name}\` assigned to them as a sticky-role.`);
        } else if (flag === 'view') {
            if (!args[1]) return message.channel.send(`Found \`${this.client.stickyRoles.get(message.guild.id).length}\` sticky-roles for ${message.guild.name}`);
            const member = message.mentions.members.first() || message.guild.members.get(args[1]);
            if (!member) return this.client.error(message, 'You must provide a valid user mention or ID.');
            const hasStickyRoles = async () => {
                let res = [];
                let counter = 0;
                this.client.stickyRoles.get(message.guild.id).forEach(i => {
                    if (i.includes(member.user.id)) {
                        let role = message.guild.roles.get(i.split('-')[1]).name;
                        let num = ++counter;
                        res.push(`[${counter}] ${role}`);
                    };
                });
                return res;
            }; 
            const roles = await hasStickyRoles();
            if (roles.length < 1) return message.channel.send(`\`${member.user.tag}\` has no sticky roles.`);
            return message.channel.send(`Found \`${roles.length}\` Sticky-${roles.length === 1 ? 'Role' : 'Roles'} for \`${member.user.tag}\`:\`\`\`${roles.join('\n')}\`\`\``);
        } else if (['rem', 'remove', 'del', 'delete'].includes(flag)) {
            if (!args[1]) return this.client.error(message, 'You must provide a valid user mention or ID.');
            if (!args[2]) return this.client.error(message, 'You must provide a valid role mention, name, or ID.');
            const member = message.mentions.members.first() || message.guild.members.get(args[1]);
            if (!member) return this.client.error(message, 'You must provide a valid user mention or ID.');
            const role = message.mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(args.slice(2).join(' ').toLowerCase())) || message.guild.roles.get(args[2]);
            if (!role) return this.client.error(message, 'You must provide a valid role mention, name, or ID.');
            if (!this.client.stickyRoles.get(message.guild.id).includes(`${member.user.id}-${role.id}`)) {
                return this.client.error(message, `\`${member.user.tag}\` does not have the role \`${role.name}\` assigned to them as a sticky role.`);
            };
            const index = this.client.stickyRoles.get(message.guild.id).indexOf(`${member.user.id}-${role.id}`);
            this.client.stickyRoles.get(message.guild.id).splice(index, 1);
            this.client.stickyRoles.set(message.guild.id, this.client.stickyRoles.get(message.guild.id));
            try {
                await member.removeRole(role.id, 'Removing Sticky-Roles');
            } catch (e) {
                return this.client.error(message, `Error removing their role: \`${e.message}\``);
            };
            return message.channel.send(`${this.client.emotes.check} \`${member.user.tag}\` no longer has the role \`${role.name}\` assigned to them as a sticky-role.`);
        };
    };
};

module.exports = StickyRole;
