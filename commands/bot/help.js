const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
const help = require('../../functions/help.js');

class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            category: 'bot',
            description: 'View help for the bot\'s commands, or view help on a specific command.',
            usage: '{prefix}help [--category|command]',
            parameters: 'stringFlag, stringCommand',
            extended: true,
            extended_help: 'To view help on a category: {prefix}help --<category>\nTo view help on a command: {prefix}help <command>',
            enabled: true,
            reason: null,
            guildOnly: false,
            devOnly: false,
            permission: 'SEND_MESSAGES',
            bot_permission: 'EMBED_LINKS',
            aliases: []
        });
    };

    async run(message, args) {
        //   if (!message.guild) {
        //     if (!args[0]) {
        //         const embed = new RichEmbed()
        //             .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
        //             .setTitle(`${this.client.user.username} Help Menu`)
        //             .addField('Administrative', help.admin(this.client, message))
        //             .addField('Bot', help.bot(this.client, message))
        //             .addField('Fun', help.fun(this.client, message))
        //             .addField('Moderation', help.moderation(this.client, message))
        //             .addField('Music', help.music(this.client, message))
        //             .addField('Trivia', help.trivia(this.client, message))
        //             .addField('Utility', help.utility(this.client, message))
        //             .setColor(this.client.color);
        //         return message.channel.send(embed);
        //     };
        //     const command = args[0].toLowerCase();
        //     const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        //     if (!cmd) return;
        //     const name = cmd.help.name.split('')[0].toUpperCase() + cmd.help.name.split('').slice(1).join('');
        //     const desc = cmd.help.description;
        //     const usage = cmd.help.usage.replace('{prefix}', message.settings.prefix).replace('{prefix}', message.settings.prefix);
        //     const params = `\`\`\`${cmd.help.parameters}\`\`\``;
        //     const aliases = cmd.conf.aliases.length > 0 ? `\`[${cmd.conf.aliases.join(', ')}]\`` : 'No aliases.';
        //     const embed = new RichEmbed()
        //         .setColor(this.client.color)
        //         .setAuthor(`${this.client.user.username} | Command: ${name}`, this.client.user.displayAvatarURL)
        //         .addField('Description', desc)
        //         .addField('Usage', usage)
        //         .addField('Parameters', params)
        //         .addField('Aliases', aliases);
        //     if (!cmd.help.extended) return message.channel.send(embed);
        //     embed.addField('Extended Help', cmd.help.extended_help.replace('{prefix}', message.settings.prefix).replace('{prefix}', message.settings.prefix));
        //     return message.channel.send(embed);              
        // };
        if (!args[0]) {
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
                .setDescription(`To view commands in a category, run \`${message.settings.prefix}help --<category>\`.\nTo view help on a specific command, run \`${message.settings.prefix}help <command>\``)
                .addField('» Available Categories', '`admin`, `bot`, `fun`, `moderation | mod`, `music`, `trivia`, `utility`')
                .setFooter(`» Total Commands: ${this.client.commands.size}`);
            return message.channel.send(embed);
        };
        let flag = args[0].includes('--') ? args[0].split('--')[1].toLowerCase() : false;
        if (!flag) {
            const command = args[0].toLowerCase();
            const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
            if (!cmd) return;
            if (!message.member.permissions.has(cmd.conf.permission)) return reject(cmd.conf.permission);
            const name = cmd.help.name.split('')[0].toUpperCase() + cmd.help.name.split('').slice(1).join('');
            const desc = cmd.help.description;
            const usage = cmd.help.usage.replace('{prefix}', message.settings.prefix).replace('{prefix}', message.settings.prefix);
            const params = `\`\`\`${cmd.help.parameters}\`\`\``;
            const aliases = cmd.conf.aliases.length > 0 ? `\`[${cmd.conf.aliases.join(', ')}]\`` : 'No aliases.';
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(`${this.client.user.username} | Command: ${name}`, this.client.user.displayAvatarURL)
                .addField('Description', desc)
                .addField('Usage', usage)
                .addField('Parameters', params)
                .addField('Aliases', aliases);
            if (!cmd.help.extended) return message.channel.send(embed);
            embed.addField('Extended Help', cmd.help.extended_help.replace('{prefix}', message.settings.prefix).replace('{prefix}', message.settings.prefix));
            return message.channel.send(embed); 
        };
        const reject = (perm) => {
            return message.channel.send(`${this.client.emotes.x} You lack the permission \`${perm}\` and cannot see help for this command or category.`);
        };
        const cmds = (cat) => {
            let array = [];
            this.client.commands.forEach(i => {
                if (i.help.category !== cat) return;
                array.push(`${message.settings.prefix}${i.help.name} - ${i.help.description}`);
            });
            return array.join('\n');
        };
        if (flag === 'admin') {
            if (!message.member.permissions.has('ADMINISTRATOR')) return reject('ADMINISTRATOR');
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(`${this.client.user.username} | Category: Admin`, this.client.user.displayAvatarURL)
                .setDescription(cmds('admin'))
                .setFooter(`» Need help on a specific command? Run ${message.settings.prefix}help <command>`);
            return message.channel.send(embed);
        } else if (flag === 'bot') {
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(`${this.client.user.username} | Category: Bot`)
                .setDescription(cmds('bot'))
                .setFooter(`» Need help on a specific command? Run ${message.settings.prefix}help <command>`);
            return message.channel.send(embed);
        } else if (flag === 'fun') {
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(`${this.client.user.username} | Category: Fun`)
                .setDescription(cmds('fun'))
                .setFooter(`» Need help on a specific command? Run ${message.settings.prefix}help <command>`);
            return message.channel.send(embed);
        } else if (flag === 'mod' || flag === 'moderation') {
            if (!message.member.permissions.has('KICK_MEMBERS')) return reject('KICK_MEMBERS');
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(`${this.client.user.username} | Category: Moderation`)
                .setDescription(cmds('moderation'))
                .setFooter(`» Need help on a specific command? Run ${message.settings.prefix}help <command>`);
            return message.channel.send(embed);
        } else if (flag === 'trivia') {
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(`${this.client.user.username} | Category: Trivia`)
                .setDescription(cmds('trivia'))
                .setFooter(`» Need help on a specific command? Run ${message.settings.prefix}help <command>`);
            return message.channel.send(embed);
        } else if (flag === 'utility') {
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(`${this.client.user.username} | Category: Utility`)
                .setDescription(cmds('utility'))
                .setFooter(`» Need help on a specific command? Run ${message.settings.prefix}help <command>`);
            return message.channel.send(embed);
        } else return;      
    };
};

module.exports = Help;
