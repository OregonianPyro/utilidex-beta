module.exports = async (m, message) => {
    let filter = m => m.author.id === message.author.id;
    let msg = await m.channel.send('What would you like to see? Options: `all`, `logging`, `roles`, `ignored`, `disabled commands`, `automod`, `welcome config`, `leave config`.\n\nThis menu will time out after 30 seconds.');
    m.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(msgs => {
            let option = msgs.first().content.toLowerCase();
            if (!['all', 'logging', 'roles', 'ignored', 'disabled commands', 'automod', 'welcome config', 'leave config'].includes(option)) {
                return msgs.first().delete(), msg.edit(`${msg.client.emotes.x} It seems you provied an invalid option. Try again.`);
            };
            if (option === 'all') {
                let prefix = m.settings.prefix;
                m.settings.ignored.users.forEach(u => {
                    if (m.settings.ignored.users.length < 1) return;
                    ignored_arrays.users.push(msg.client.fetchuser(u).tag);
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
            } else if (option === 'logging') {
                let logs = {
                    modlog: `Enabled: ${m.settings.logging.modlog.enabled} | Channel: ${m.settings.logging.modlog.channel ? `#${m.guild.channels.get(m.settings.logging.modlog.channel).name}` : 'No Channel'}`,
                    msglog: `Enabled: ${m.settings.logging.msglog.enabled} | Channel: ${m.settings.logging.msglog.channel ? `#${m.guild.channels.get(m.settings.logging.msglog.channel).name}` : 'No Channel'}`,
                    nicklog: `Enabled: ${m.settings.logging.nicklog.enabled} | Channel: ${m.settings.logging.nicklog.channel ? `#${m.guild.channels.get(m.settings.logging.nicklog.channel).name}` : 'No Channel'}`,
                    rolelog: `Enabled: ${m.settings.logging.rolelog.enabled} | Channel: ${m.settings.logging.rolelog.channel ? `#${m.guild.channels.get(m.settings.logging.rolelog.channel).name}` : 'No Channel'}`,
                    imagelog: `Enabled: ${m.settings.logging.imagelog.enabled} | Channel: ${m.settings.logging.imagelog.channel ? `#${m.guild.channels.get(m.settings.logging.imagelog.channel).name}` : 'No Channel'}`,
                    serverlog: `Enabled: ${m.settings.logging.serverlog.enabled} | Channel: ${m.settings.logging.serverlog.channel ? `#${m.guild.channels.get(m.settings.logging.serverlog.channel).name}` : 'No Channel'}`
                };
                msgs.first().delete();
                return msg.edit(`Current Logging Settings for: ${m.guild.name}\n\`\`\`modlog: ${logs.modlog}\nmessage log: ${logs.msglog}\nnickname log: ${logs.nicklog}\nimage log: ${logs.imagelog}\nrole log: ${logs.rolelog}\nserver log: ${logs.serverlog}\`\`\``);
            } else if (option === 'roles') {
                let roles = {
                    muterole: m.settings.mute_role ? m.guild.roles.get(m.settings.mute_role).name : 'Not Set',
                    staffrole: m.settings.staff ? m.guild.roles.get(m.settings.staff).name : 'Not Set'
                };
                msgs.first().delete();
                // m.channel.fetchMessages({ limit: 2 }).then(m => {
                //     let msgs = m.filter(m => m.author.id === message.author.id);
                //     message.channel.bulkDelete(msgs);
                // });
                // m.channel.fetchMessages({ limit: 1 }).then(m => {
                //     let msgs = m.filter(m => m.author.id === message.client.user.id);
                //     message.channel.bulkDelete(msgs);
                // });
                return message.channel.send(`Current Role Settings for: ${m.guild.name}\n\`\`\`mute role: ${roles.muterole}\nstaff role: ${roles.staffrole}\`\`\``);
            } else if (option === 'ignored') {
                let users = [];
                let roles = [];
                let channels = [];
                m.settings.ignored.users.forEach(u => users.push(this.client.fetchuser(u).tag));
                m.settings.ignored.roles.forEach(r => roles.push(m.guild.roles.get(r).name));
                m.settings.ignored.channels.forEach(c => channels.push(m.guild.channels.get(c).name));
                msgs.first().delete();
                msg.delete();
                return m.channel.send(`Current Blacklisted Users, Roles, and Channels for: ${m.guild.name}\n\`\`\`users: ${users.length > 0 ? users.join(', ') : 'None'}\nroles: ${roles.length > 0 ? roles.join(', ') : 'None'}\nchannels: ${channels.length > 0 ? channels.join(', ') : 'None'}\`\`\``);
            } else if (option === 'disabled commands') {
                msgs.first().delete();
                msg.delete();
                m.channel.send(`Current Disabled Commands for: ${m.guild.name}\n\`\`\`${m.settings.disabled_commands.length > 0 ? m.settings.disabled_commands.join(', ') : 'No Disabled Commands'}\`\`\``);
            } else if (option === 'automod') {
                return;
            } else if (option === 'welcome config') {
                let enabled = m.settings.welcome_config.enabled ? 'Enabled' : 'Not Enabled';
                let conf = {
                    color: m.settings.welcome_config.type === 'embed' ? (m.settings.welcome_config.color ? m.settings.welcome_config.color : m.client.color) : 'Color can only be set for \'embed\' types',
                    type: m.settings.welcome_config.type,
                    channel: m.settings.welcome_config.channel ? m.guild.channels.get(m.settings.welcome_config.channel).name : 'Not Set',
                    message: m.settings.welcome_config.message,
                    footer: m.settings.welcome_config.type === 'embed' ? ( m.settings.welcome_config.footer ? m.settings.welcome_config.footer : 'Not Set') : 'Footers can only be set for \'embed\' types'
                };
                msgs.first().delete();
                msg.delete();
                return m.channel.send(`Current Welcome Message Configuration for: ${m.guild.name}\n\`\`\`enabled: ${enabled}\ntype: ${conf.type}\nchannel: ${conf.channel}\ncolor: ${conf.color}\n\nmessage: ${conf.message}\n\nfooter message: ${conf.footer}\`\`\``);
            } else if (option === 'leave config') {
                let enabled = m.settings.leave_config.enabled ? 'Enabled' : 'Not Enabled';
                let conf = {
                    color: m.settings.leave_config.type === 'embed' ? (m.settings.leave_config.color ? m.settings.leave_config.color : m.client.color) : 'Color can only be set for \'embed\' types',
                    type: m.settings.leave_config.type,
                    channel: m.settings.leave_config.channel ? m.guild.channels.get(m.settings.leave_config.channel).name : 'Not Set',
                    message: m.settings.leave_config.message,
                    footer: m.settings.leave_config.type === 'embed' ? (m.settings.leave_config.footer ? m.settings.leave_config.footer : 'Not Set') : 'Footers can only be set for \'embed\' types'
                };
                msgs.first().delete();
                msg.delete();
                return m.channel.send(`Current Leave Message Configuration for: ${m.guild.name}\n\`\`\`enabled: ${enabled}\ntype: ${conf.type}\nchannel: ${conf.channel}\ncolor: ${conf.color}\n\nmessage: ${conf.message}\n\nfooter message: ${conf.footer}\`\`\``);
            };
        });
    };