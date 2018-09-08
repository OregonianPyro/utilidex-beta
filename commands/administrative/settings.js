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
        const view = async (m) => {
            let filter = m => m.author.id === message.author.id;
            let msg = await m.channel.send('What would you like to see? Options: `all`, `logging`, `roles`, `ignored`, `disabled commands`, `automod`, `welcome config`, `leave config`.\n\nThis menu will time out after 30 seconds.');
            m.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(msgs => {
                    let option = msgs.first().content.toLowerCase();
                    if (!['all', 'logging', 'roles', 'ignored', 'disabled commands', 'automod', 'welcome config', 'leave config'].includes(option)) {
                        return msgs.first().delete(), msg.edit(`${this.client.emotes.x} It seems you provied an invalid option. Try again.`);
                    };
                    if (option === 'all') {
                        let prefix = m.settings.prefix;
                        m.settings.ignored.users.forEach(u => {
                            if (m.settings.ignored.users.length < 1) return;
                            ignored_arrays.users.push(this.client.fetchuser(u).tag);
                        });
                        m.settings.ignored.roles.forEach(r => {
                            if (m.settings.ignored.roles.length < 1) return;
                            ignored_arrays.roles.push(m.guild.roles.get(r).name);
                        });
                        m.settings.ignored.channels.forEach(c => {
                            if (m.settings.ignored.channels.length < 1) return;
                            ignored_arrays.channels.push(m.guild.channels.get(c).name);
                        });
                        let logs = {
                            modlog: `Enabled: ${m.settings.logging.modlog.enabled} | Channel: ${m.settings.logging.modlog.channel ? `#${m.guild.channels.get(m.settings.logging.modlog.channel).name}` : 'No Channel'}`,
                            msglog: `Enabled: ${m.settings.logging.msglog.enabled} | Channel: ${m.settings.logging.msglog.channel ? `#${m.guild.channels.get(m.settings.logging.msglog.channel).name}` : 'No Channel'}`,
                            nicklog: `Enabled: ${m.settings.logging.nicklog.enabled} | Channel: ${m.settings.logging.nicklog.channel ? `#${m.guild.channels.get(m.settings.logging.nicklog.channel).name}` : 'No Channel'}`,
                            rolelog: `Enabled: ${m.settings.logging.rolelog.enabled} | Channel: ${m.settings.logging.rolelog.channel ? `#${m.guild.channels.get(m.settings.logging.rolelog.channel).name}` : 'No Channel'}`,
                            imagelog: `Enabled: ${m.settings.logging.imagelog.enabled} | Channel: ${m.settings.logging.imagelog.channel ? `#${m.guild.channels.get(m.settings.logging.imagelog.channel).name}` : 'No Channel'}`,
                            serverlog: `Enabled: ${m.settings.logging.serverlog.enabled} | Channel: ${m.settings.logging.serverlog.channel ? `#${m.guild.channels.get(m.settings.logging.serverlog.channel).name}` : 'No Channel'}`
                        };
                        let roles = {
                            muterole: m.settings.mute_role ? m.guild.roles.get(m.settings.mute_role).name : 'Not Set',
                            staffrole: m.settings.staff ? m.guild.roles.get(m.settings.staff).name : 'Not Set'
                        };
                        let ignored_arrays = {
                            users: [],
                            roles: [],
                            channels: []
                        };
                       let ignored = {
                           users: ignored_arrays.users.length > 0 ? ignored_arrays.users.join(', ') : 'Not Set',
                           roles: ignored_arrays.roles.length > 0 ? ignored_arrays.roles.join(', ') : 'Not Set',
                           channels: ignored_arrays.channels.length > 0 ? ignored_arrays.channels.join(', ') : 'Not Set'
                       };
                       let cmds = m.settings.disabled_commands.length > 0 ? m.settings.disabled_commands.join(', ') : 'Not Set';
                       msgs.first().delete();
                       return msg.edit(`Current Settings for: ${m.guild.name}\n\`\`\`prefix: ${prefix}\nmodlog: ${logs.modlog}\nnickname log: ${logs.nicklog}\nmessage log: ${logs.msglog}\nimage log: ${logs.imagelog}\nrole log: ${logs.rolelog}\nserver log: ${logs.serverlog}\n` +
                                `muted role: ${roles.muterole}\nstaff role: ${roles.staffrole}\nignored users: ${ignored.users}\nignored roles: ${ignored.roles}\nignored channels: ${ignored.channels}\ndisabled commands: ${cmds}\`\`\``);
                    };
                });
        };
        const edit = (m) => {
            let filter = m => m.author.id === message.author.id;
            m.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(msgs => {
                    let key = msgs.first().content.toLowerCase();
                    let keys = ['prefix', 'modlog', 'message log', 'nick log', 'role log', 'server log', 'image log', 'mute role', 'staff role', 'welcome config', 'leave config'];
                    if (!keys.includes(key)) return msgs.first().delete(), msg.edit(`${this.client.emotes.x} Whoops! It seems the key you provided was invalid.`);
                    key = keys.indexOf(key);
                    key = keys[key];
                    if (key === 'prefix') {
                        msgs.first().delete();
                        msg.edit('```What should the new prefix be?```\n:stopwatch: This will time out in 30 seconds.');
                        m.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                            .then(msgs => {
                                if (msgs.first().content.split(' ')[0].length >= 10) return msgs.first().delete(), msg.edit(`${this.client.emotes.x} Hmm..that seems like a long prefix! Try a shorter one.`);
                                m.settings.prefix = msgs.first().content.split(' ')[0];
                                this.client.settings.set(m.guild.id, m.settings);
                                return msgs.first().delete(), message.channel.send(`${this.client.emotes.check} Your prefix is now \`${m.settings.prefix}\``);
                            });
                    };
                });
        };
        let msg = await message.channel.send('Welcome to Utilidex\'s settings menu! To get started, provide an action. The list of actions are: `view`, `edit`, `reset`\n\nThis menu will timeout after one minute.');
        let filter = m => m.author.id === message.author.id;
        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).then(msgs => {
            let flag = msgs.first().content.split(' ')[0].toLowerCase();
            if (flag === 'view') {
                return view(msgs.first());
            } else if (flag === 'edit') {
                msgs.first().delete();
                msg.edit('To edit a current settings, please provide a valid key. Valid keys are:```prefix, modlog, message log, nick log, image log, role log, server log, mute role, staff role, welcome config, leave config```\n:stopwatch: This menu will time out after __30 seconds__');
                return edit(msgs.first());
            } else if (flag === 'reset') {

            };
        });
    };
 };

 module.exports = Settings;
