const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

 class Settings extends Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            category: 'admin',
            description: 'View, edit, or reset the settings for your server.',
            usage: '{prefix}settings <view|edit|reset> <key> [value]',
            parameters: 'stringFlag, stringKey, *Value',
            extended: true,
            extended_help: 'To configure your welcome / leave settings, use this format:\n`{prefix}settings edit <welcome|leave> <key> <value>`\nAvailable Keys: `enabled`, `color`, `channel`, `message`, `type`, `footer`',
            enabled: true,
            reason: false,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_GUILD',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['set', 'conf']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'settings');
        let flag = args[0].toLowerCase();
        /**
         * @param {string} key The key. 
         * @param {string} val The value.
         * @returns {object} Returns an embed to send.
         */
        const success = (key, val) => {
            const embed = new RichEmbed()
                .setColor('GREEN')
                .setDescription(`${this.client.emotes.check} Successfully set your \`${key}\` to \`${val}\``);
            return message.channel.send(embed);
        };
        /**
         * @param {string} Error The error. 
         * @returns {object} Returns an embed to send.
         */
        const fail = (err) => {
            const embed = new RichEmbed()
                .setColor('RED')
                .setDescription(`${this.client.emotes.x} Error: ${err}`);
            return message.channel.send(embed);
        };
        if (flag === 'view') {

        } else if (flag === 'edit') {
            if (!args[1]) return fail('Must supply a key to edit.');
            let key = args[1].toLowerCase();
            if (key === 'prefix') {
                const new_prefix = args[2];
                if (!new_prefix || new_prefix.length >= 10) return fail('No prefix was provided, or the prefix exceeded 10 characters.');
                message.settings.prefix = new_prefix;
                this.client.settings.set(message.guild.id, message.settings);
                return success('prefix', new_prefix);
            } else if (key === 'msglog') {
                if (!args[2]) return fail('No channel was provided.');
                if (args[2].toLowerCase() === 'off' || args[2].toLowerCase() === 'false') {
                    message.settings.logging.msglog.enabled = false;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('message log', 'false');
                };
                if (args[2].toLowerCase() === 'on' || args[2].toLowerCase() === 'true') {
                    message.settings.logging.msglog.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('message log', 'true');
                };
                const new_log = message.mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(args[2].toLowerCase())) || message.guild.channels.get(args[2]);
                if (!new_log) return fail('Invalid channel - Channel does not exist.');
                message.settings.logging.msglog.channel = new_log.id;
                message.settings.logging.msglog.enabled = true;
                this.client.settings.set(message.guild.id, message.settings);
                return success('message log', new_log.name);
            } else if (key === 'nicklog') {
                if (!args[2]) return fail('No channel was provided.');
                if (args[2].toLowerCase() === 'off' || args[2].toLowerCase() === 'false') {
                    message.settings.logging.nicklog.enabled = false;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('nickname log', 'false');
                };
                if (args[2].toLowerCase() === 'on' || args[2].toLowerCase() === 'true') {
                    message.settings.logging.nicklog.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('nickname log', 'true');
                };
                const new_log = message.mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(args[2].toLowerCase())) || message.guild.channels.get(args[2]);
                if (!new_log) return fail('Invalid channel - Channel does not exist.');
                message.settings.logging.nicklog.channel = new_log.id;
                message.settings.logging.nicklog.enabled = true;
                this.client.settings.set(message.guild.id, message.settings);
                return success('nickname log', new_log.name);
            } else if (key === 'modlog') {
                if (!args[2]) return fail('No channel was provided.');
                if (args[2].toLowerCase() === 'off' || args[2].toLowerCase() === 'false') {
                    message.settings.logging.modlog.enabled = false;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('moderation log', 'false');
                };
                if (args[2].toLowerCase() === 'on' || args[2].toLowerCase() === 'true') {
                    message.settings.logging.modlog.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('moderation log', 'true');
                };
                const new_log = message.mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(args[2].toLowerCase())) || message.guild.channels.get(args[2]);
                if (!new_log) return fail('Invalid channel - Channel does not exist.');
                message.settings.logging.modlog.channel = new_log.id;
                message.settings.logging.modlog.enabled = true;
                this.client.settings.set(message.guild.id, message.settings);
                return success('moderation log', new_log.name);
            } else if (key === 'imagelog') {
                if (!args[2]) return fail('No channel was provided.');
                if (args[2].toLowerCase() === 'off' || args[2].toLowerCase() === 'false') {
                    message.settings.logging.imagelog.enabled = false;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('image log', 'false');
                };
                if (args[2].toLowerCase() === 'on' || args[2].toLowerCase() === 'true') {
                    message.settings.logging.imagelog.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('image log', 'true');
                };
                const new_log = message.mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(args[2].toLowerCase())) || message.guild.channels.get(args[2]);
                if (!new_log) return fail('Invalid channel - Channel does not exist.');
                message.settings.logging.imagelog.channel = new_log.id;
                message.settings.logging.imagelog.enabled = true;
                this.client.settings.set(message.guild.id, message.settings);
                return success('image log', new_log.name);
            } else if (key === 'rolelog') {
                if (!args[2]) return fail('No channel was provided.');
                if (args[2].toLowerCase() === 'off' || args[2].toLowerCase() === 'false') {
                    message.settings.logging.rolelog.enabled = false;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('rolelog', 'false');
                };
                if (args[2].toLowerCase() === 'on' || args[2].toLowerCase() === 'true') {
                    message.settings.logging.rolelog.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('rolelog', 'true');
                };
                const new_log = message.mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(args[2].toLowerCase())) || message.guild.channels.get(args[2]);
                if (!new_log) return fail('Invalid channel - Channel does not exist.');
                message.settings.logging.rolelog.channel = new_log.id;
                message.settings.logging.rolelog.enabled = true;
                this.client.settings.set(message.guild.id, message.settings);
                return success('rolelog channel', new_log.name);
            } else if (key === 'serverlog') {
                if (!args[2]) return fail('No channel was provided.');
                if (args[2].toLowerCase() === 'off' || args[2].toLowerCase() === 'false') {
                    message.settings.logging.serverlog.enabled = false;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('server log', 'false');
                };
                if (args[2].toLowerCase() === 'on' || args[2].toLowerCase() === 'true') {
                    message.settings.logging.serverlog.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('server log', 'true');
                };
                const new_log = message.mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(args[2].toLowerCase())) || message.guild.channels.get(args[2]);
                if (!new_log) return fail('Invalid channel - Channel does not exist.');
                message.settings.logging.serverlog.channel = new_log.id;
                message.settings.logging.serverlog.enabled = true;
                this.client.settings.set(message.guild.id, message.settings);
                return success('server log', new_log.name);
            } else if (key === 'muterole') {
                if (!args[2]) return fail('No role was provided.');
                const new_role = message.mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(args[2].toLowerCase())) || message.guild.roles.get(args[2]);
                if (!new_log) return fail('Invalid role - Role does not exist.');
                message.settings.muterole = new_role.id;
                this.client.settings.set(message.guild.id, message.settings);
                return success('muted role', new_role.name);
            } else if (key === 'welcome' || key === 'join') {
                if (!args[2]) return fail('No `welcome` key was provided.');
                let key = args[2].toLowerCase();
                if (key === 'off' || key === 'false') {
                    message.settings.welcome_config.enabled = false;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('welcome message', 'false');
                };
                if (key === 'on' || key === 'true') {
                    message.settings.welcome_config.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('welcome message', 'true');
                };
                if (key === 'type') {
                    if (!args[3]) return fail('No type was provided.');
                    let type = args[3].toLowerCase();
                    if (type !== 'text' && type !== 'embed') return fail("Variable 'type' can only be `text` or `embed`");
                    message.settings.welcome_config.type = type;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('welcome message type', type);
                } else if (key === 'channel') {
                    const new_log = message.mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(args[3].toLowerCase())) || message.guild.channels.get(args[3]);
                    if (!new_log) return fail('Invalid channel - Channel does not exist.');
                    message.settings.welcome_config.channel = new_log.id;
                    message.settings.welcome_config.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('welcome channel', new_log.name);
                } else if (key === 'message') {
                    if (!args[3]) return fail('No message was provided.');
                    let msg = args.slice(2).join(' ');
                    message.settings.welcome_config.message = msg;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('welcome message', msg);
                } else if (key === 'color') {
                    if (!args[3]) return fail('No color was provided.');
                    let color = args[3];
                    message.settings.welcome_config.color = color;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('welcome message color', color);
                } else if (key === 'footer') {
                    if (!args[3]) return fail('No footer message was provided.');
                    let msg = args.slice(2).join(' ');
                    message.settings.welcome_config.footer = msg;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('welcome footer message', msg);
                };
            } else if (key === 'leave') {
                if (!args[2]) return fail('No `leave` key was provided.');
                let key = args[2].toLowerCase();
                if (key === 'off' || key === 'false') {
                    message.settings.leave_config.enabled = false;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('leave message', 'false');
                };
                if (key === 'on' || key === 'true') {
                    message.settings.leave_config.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('leave message', 'true');
                };
                if (key === 'type') {
                    if (!args[3]) return fail('No type was provided.');
                    let type = args[3].toLowerCase();
                    if (type !== 'text' && type !== 'embed') return fail("Variable 'type' can only be `text` or `embed`");
                    message.settings.leave_config.type = type;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('leave message type', type);
                } else if (key === 'channel') {
                    const new_log = message.mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(args[3].toLowerCase())) || message.guild.channels.get(args[3]);
                    if (!new_log) return fail('Invalid channel - Channel does not exist.');
                    message.settings.leave_config.channel = new_log.id;
                    message.settings.leave_config.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('leave channel', new_log.name);
                } else if (key === 'message') {
                    if (!args[3]) return fail('No message was provided.');
                    let msg = args.slice(2).join(' ');
                    message.settings.leave_config.message = msg;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('leave message', msg);
                } else if (key === 'color') {
                    if (!args[3]) return fail('No color was provided.');
                    let color = args[3];
                    message.settings.leave_config.color = color;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('leave message color', color);
                } else if (key === 'footer') {
                    if (!args[3]) return fail('No footer message was provided.');
                    let msg = args.slice(2).join(' ');
                    message.settings.leave_config.footer = msg;
                    this.client.settings.set(message.guild.id, message.settings);
                    return success('leave footer message', msg);
                };
            } else if (key === 'staff') {

            };
        } else if (flag === 'reset') {

        } else {

        };
    };
 };

 module.exports = Settings;
