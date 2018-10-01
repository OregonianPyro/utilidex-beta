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
        const { handleChannel, ignored } = this;
        let msg = await message.channel.send('Welcome to Utilidex\'s settings menu! To get started, provide an action. The list of actions are: `view`, `edit`, `reset`\n\n:stopwatch: This menu will timeout after one minute.');
        let filter = m => m.author.id === message.author.id;
        let obj = { max: 1, time: 60000, errors: ['time'] };
        let prompt = ':stopwatch: This menu will timeout after one minute.\n> Type `cancel` to cancel the menu.';
        message.channel.awaitMessages(filter, obj).then(async msgs => {
            msgs.first().delete();
            let flag = msgs.first().content.split(' ')[0].toLowerCase();
            if (flag === 'view') {
                const logs = {
                    modlog: handleChannel('modlog', message),
                    nicklog: handleChannel('nicklog', message),
                    msglog: handleChannel('msglog', message),
                    rolelog: handleChannel('rolelog', message),
                    serverlog: handleChannel('serverlog', message),
                    //memberlog: handleChannel('memberlog', message) || 'Not Set',
                    imagelog: handleChannel('imagelog', message),
                };
                const roles = {
                    muterole: message.settings.mute_role ? message.guild.roles.get(message.settings.mute_role).name : 'Not Set',
                    staffrole: message.settings.staff_role ? message.guild.roles.get(message.settings.staff_role).name : 'Not Set'
                };
                const welcome_config = {
                    channel: message.settings.welcome_config.channel ? `#${message.guild.channels.get(message.settings.welcome_config.channel).name}` : 'Not Set',
                    enabled: message.settings.welcome_config.enabled,
                    message: message.settings.welcome_config.message ? message.settings.welcome_config.message : 'Not Set',
                    type: message.settings.welcome_config.type,
                    color: message.settings.welcome_config.color,
                    footer: message.settings.welcome_config.footer ? message.settings.welcome_config.footer : 'Not Set'
                };
                const leave_config = {
                    channel: message.settings.leave_config.channel ? `#${message.guild.channels.get(message.settings.leave_config.channel).name}` : 'Not Set',
                    enabled: message.settings.leave_config.enabled,
                    message: message.settings.leave_config.message ? message.settings.leave_config.message : 'Not Set',
                    type: message.settings.leave_config.type,
                    color: message.settings.leave_config.color,
                    footer: message.settings.leave_config.footer ? message.settings.leave_config.footer : 'Not Set'
                };
                const ignored = await this.ignored(message);
                const embed = new RichEmbed()
                    .setColor(message.guild.me.highestRole.hexColor)
                    .setAuthor(message.guild.name, message.guild.iconURL)
                    .setDescription(`Current Bot Configuration for ${message.guild.name}`)
                    .addField('Prefix', `\`\`\`${message.settings.prefix}\`\`\``)
                    .addField('Logs', `\`\`\`modlog: ${logs.modlog}\nmessage log: ${logs.msglog}\nnickname log: ${logs.nicklog}\nserver log: ${logs.serverlog}\nrole log: ${logs.rolelog}\nmember log: Not Set\nimage log: ${logs.imagelog}\`\`\``)
                    .addField('Roles', `\`\`\`mute role: ${roles.muterole}\nstaff role: ${roles.staffrole}\`\`\``)
                    .addField('Ignored', `\`\`\`users: ${ignored.users.length > 0 ? ignored.users.join(', ') : 'No Ignored Users'}\nroles: ${ignored.roles.length > 0 ? ignored.roles.join(', ') : 'No Ignored Roles'}\nchannels:${ignored.channels.length > 0 ? ignored.channels.join(', ') : 'No Ignored Channels'}\`\`\``)
                    .addField('Welcome Config', `\`\`\`enabled: ${welcome_config.enabled}\nchannel: ${welcome_config.channel}\nmessage: ${welcome_config.message}\ntype: ${welcome_config.type}\ncolor: ${welcome_config.color}\nfooter message: ${welcome_config.footer}\`\`\``)
                    .addField('Leave Config', `\`\`\`enabled: ${leave_config.enabled}\nchannel: ${leave_config.channel}\nmessage: ${leave_config.message}\ntype: ${leave_config.type}\ncolor: ${leave_config.color}\nfooter message: ${leave_config.footer}\`\`\``)
                    .addField('Automod', '```Automod is not curently configurable.```');
                return msg.edit(embed);
            } else if (flag === 'edit') {
                msgs.first().delete();
                msg.edit('```What would you like to edit? Available options:\nprefix, modlog, msglog, nicklog, rolelog, serverlog, imagelog, muterole, staffrole, ignored, welcome config, leave config```' + prompt);
                msgs.first().channel.awaitMessages(filter, obj).then(async msgs => {
                    msgs.first().delete();
                    const key = msgs.first().content.toLowerCase();
                    if (key === 'prefix') {
                        msg.edit('```What should the new prefix be?```' + prompt);
                        msgs.first().channel.awaitMessages(filter, obj).then(async msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            if (msgs.first().content.split(' ')[0].length >= 10) return msg.edit(`${this.client.emotes.x} Woah there! That seems like a long prefix, try again.`);
                            message.settings.prefix = msgs.first().content.split(' ')[0];
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Your prefix has been changed to \`${message.settings.prefix}\``);
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'modlog') {
                        msg.edit('```If you want to set the channel, provide a valid channel mention, name, or ID.\nIf you want to enable / disable your moderation logging, type \'enable\' or \'disable\'```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            if (msgs.first().content.toLowerCase() === 'enable') {
                                message.settings.logging.modlog.enabled = true;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully enabled your moderation logging.`);
                            };
                            if (msgs.first().content.toLowerCase() === 'disable') {
                                message.settings.logging.modlog.enabled = false;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully disabled your moderation logging.`);
                            };
                            let channel = msgs.first().mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.channels.get(msgs.first().content);
                            if (!channel) return msg.edit(`${this.client.emotes.x} Invalid channel provided.`);
                            if (channel.type !== 'text') return msg.edit(`${this.client.emotes.x} The channel provided was not a text channel.`);
                            message.settings.logging.modlog.channel = channel.id;
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Successfully set your moderation logs channel to ${channel.toString()}`);
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'msglog') {
                        msg.edit('```If you want to set the channel, provide a valid channel mention, name, or ID.\nIf you want to enable / disable your message logging, type \'enable\' or \'disable\'```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            if (msgs.first().content.toLowerCase() === 'enable') {
                                message.settings.logging.msglog.enabled = true;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully enabled your message logging.`);
                            };
                            if (msgs.first().content.toLowerCase() === 'disable') {
                                message.settings.logging.msglog.enabled = false;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully disabled your message logging.`);
                            };
                            let channel = msgs.first().mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.channels.get(msgs.first().content);
                            if (!channel) return msg.edit(`${this.client.emotes.x} Invalid channel provided.`);
                            if (channel.type !== 'text') return msg.edit(`${this.client.emotes.x} The channel provided was not a text channel.`);
                            message.settings.logging.msglog.channel = channel.id;
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Successfully set your message logs channel to ${channel.toString()}`);
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'nicklog') {
                        msg.edit('```If you want to set the channel, provide a valid channel mention, name, or ID.\nIf you want to enable / disable your nickname logging, type \'enable\' or \'disable\'```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            if (msgs.first().content.toLowerCase() === 'enable') {
                                message.settings.logging.nicklog.enabled = true;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully enabled your nickname logging.`);
                            };
                            if (msgs.first().content.toLowerCase() === 'disable') {
                                message.settings.logging.nicklog.enabled = false;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully disabled your nickname logging.`);
                            };
                            let channel = msgs.first().mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.channels.get(msgs.first().content);
                            if (!channel) return msg.edit(`${this.client.emotes.x} Invalid channel provided.`);
                            if (channel.type !== 'text') return msg.edit(`${this.client.emotes.x} The channel provided was not a text channel.`);
                            message.settings.logging.nicklog.channel = channel.id;
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Successfully set your nickname logs channel to ${channel.toString()}`);
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'rolelog') {
                        msg.edit('```If you want to set the channel, provide a valid channel mention, name, or ID.\nIf you want to enable / disable your role logging, type \'enable\' or \'disable\'```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            if (msgs.first().content.toLowerCase() === 'enable') {
                                message.settings.logging.rolelog.enabled = true;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully enabled your role logging.`);
                            };
                            if (msgs.first().content.toLowerCase() === 'disable') {
                                message.settings.logging.rolelog.enabled = false;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully disabled your role logging.`);
                            };
                            let channel = msgs.first().mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.channels.get(msgs.first().content);
                            if (!channel) return msg.edit(`${this.client.emotes.x} Invalid channel provided.`);
                            if (channel.type !== 'text') return msg.edit(`${this.client.emotes.x} The channel provided was not a text channel.`);
                            message.settings.logging.rolelog.channel = channel.id;
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Successfully set your role logs channel to ${channel.toString()}`);
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'serverlog') {
                        msg.edit('```If you want to set the channel, provide a valid channel mention, name, or ID.\nIf you want to enable / disable your server logging, type \'enable\' or \'disable\'```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            if (msgs.first().content.toLowerCase() === 'enable') {
                                message.settings.logging.serverlog.enabled = true;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully enabled your server logging.`);
                            };
                            if (msgs.first().content.toLowerCase() === 'disable') {
                                message.settings.logging.serverlog.enabled = false;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully disabled your server logging.`);
                            };
                            let channel = msgs.first().mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.channels.get(msgs.first().content);
                            if (!channel) return msg.edit(`${this.client.emotes.x} Invalid channel provided.`);
                            if (channel.type !== 'text') return msg.edit(`${this.client.emotes.x} The channel provided was not a text channel.`);
                            message.settings.logging.serverlog.channel = channel.id;
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Successfully set your server logs channel to ${channel.toString()}`);
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'imagelog') {
                        msg.edit('```If you want to set the channel, provide a valid channel mention, name, or ID.\nIf you want to enable / disable your image logging, type \'enable\' or \'disable\'```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            if (msgs.first().content.toLowerCase() === 'enable') {
                                message.settings.logging.imagelog.enabled = true;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully enabled your image logging.`);
                            };
                            if (msgs.first().content.toLowerCase() === 'disable') {
                                message.settings.logging.imagelog.enabled = false;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully disabled your image logging.`);
                            };
                            let channel = msgs.first().mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.channels.get(msgs.first().content);
                            if (!channel) return msg.edit(`${this.client.emotes.x} Invalid channel provided.`);
                            if (channel.type !== 'text') return msg.edit(`${this.client.emotes.x} The channel provided was not a text channel.`);
                            message.settings.logging.imagelog.channel = channel.id;
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Successfully set your image logs channel to ${channel.toString()}`);
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'memberlog') {
                        msg.edit('```If you want to set the channel, provide a valid channel mention, name, or ID.\nIf you want to enable / disable your member logging, type \'enable\' or \'disable\'```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            if (msgs.first().content.toLowerCase() === 'enable') {
                                message.settings.logging.memberlog.enabled = true;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully enabled your member logging.`);
                            };
                            if (msgs.first().content.toLowerCase() === 'disable') {
                                message.settings.logging.memberlog.enabled = false;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully disabled your member logging.`);
                            };
                            let channel = msgs.first().mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.channels.get(msgs.first().content);
                            if (!channel) return msg.edit(`${this.client.emotes.x} Invalid channel provided.`);
                            if (channel.type !== 'text') return msg.edit(`${this.client.emotes.x} The channel provided was not a text channel.`);
                            message.settings.logging.memberlog.channel = channel.id;
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Successfully set your member logs channel to ${channel.toString()}`);
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'muterole') {
                        msg.edit('```What should your muted role be?\nProvide a valid role mention, name, or ID.```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            let role = msgs.first().mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.roles.get(msgs.first().content);
                            if (!role) return msg.edit(`${this.client.emotes.x} Invalid role provided.`);
                            message.settings.mute_role = role.id;
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Successfully set your muted role to ${role.toString()}`);
                        }).catch((e) => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'staffrole') {
                        msg.edit('```What should your staff role be?\nProvide a valid role mention, name, or ID.```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            let role = msgs.first().mentions.roles.first() || message.guild.roles.find(r => r.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.roles.get(msgs.first().content);
                            if (!role) return msg.edit(`${this.client.emotes.x} Invalid role provided.`);
                            message.settings.staff_role = role.id;
                            this.client.settings.set(message.guild.id, message.settings);
                            return msg.edit(`${this.client.emotes.check} Successfully set your staff role to ${role.toString()}`);
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Menu timed out.`);
                        });
                    } else if (key === 'welcome config') {
                        msg.edit('```Choose a key you would like to edit:\nchannel, type, message, color, footer\n\nType \'enable\' to enable the welcoming system, or type \'disable\' to disable the welcoming system.```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(async msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            const key = msgs.first().content.toLowerCase().split(' ')[0];
                            if (key === 'enable') {
                                message.settings.welcome_config.enabled = true;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully enabled your welcoming system.`);
                            } else if (key === 'disable') {
                                message.settings.welcome_config.enabled = false;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully disabled your welcoming system.`);
                            } else if (key === 'channel') {
                                msg.edit('```What channel should your welcome message be sent to?\nProvide a valid channel mention, name, or ID.```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    let channel = msgs.first().mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.channels.get(msgs.first().content);
                                    if (!channel) return msg.edit(`${this.client.emotes.x} Invalid channel provided.`);
                                    if (channel.type !== 'text') return msg.edit(`${this.client.emotes.x} The channel provided was not a text channel.`);
                                    message.settings.welcome_config.channel = channel.id;
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your welcome channel to ${channel.toString()}`);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else if (key === 'message') {
                                msg.edit('```What message should new users be greeted with?```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    if (msgs.first().content.length >= 2000) return msg.edit(`${this.client.emotes.x} Welcome messages should be less than 2,000 characters in length.`);
                                    message.settings.welcome_config.message = msgs.first().content;
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your welcome message to\`\`\`${message.settings.welcome_config.message}\`\`\``);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else if (key === 'type') {
                                msg.edit('```What type of welcome message do you want displayed? Valid options:\ntext (normal message)\nembed (displays in an embeded message)\ncanvas (canvas-generated image)```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    if (!['text', 'embed', 'canvas'].includes(msgs.first().content.toLowerCase())) return msg.edit(`${this.client.emotes.x} Invalid type provided.`);
                                    message.settings.welcome_config.type = msgs.first().content.toLowerCase();
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your welcome type to \`${message.settings.welcome_config.type}\``);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else if (key === 'color') {
                                if (message.settings.welcome_config.type !== 'embed') return msg.edit(`${this.client.emotes.x} You can only edit this setting if your welcome type is set to '\`embed\`'`);
                                msg.edit('```What color should your welcome-message embed be?```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    message.settings.welcome_config.color = msgs.first().content;
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your welcome color to \`${message.settings.welcome_config.color}\``);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else if (key === 'footer') {
                                if (message.settings.welcome_config.type !== 'embed') return msg.edit(`${this.client.emotes.x} You can only edit this setting if your welcome type is set to '\`embed\`'`);
                                msg.edit('```What should the footer message be?```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    if (msgs.first().content.length >= 250) return msg.edit(`${this.client.emotes.x} Welcome footer messages should be less than 250 characters in length.`);
                                    message.settings.welcome_config.footer = msgs.first().content;
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your welcome footer message to\`\`\`${message.settings.welcome_config.footer}\`\`\``);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else {
                                return msg.edit(`${this.client.emotes.x} Invalid type provided.`);
                            };
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Timed out.`);
                        });
                    } else if (key === 'leave config') {
                        msg.edit('```Choose a key you would like to edit:\nchannel, type, message, color, footer\n\nType \'enable\' to enable the leave system, or type \'disable\' to disable the leave system.```' + prompt);
                        message.channel.awaitMessages(filter, obj).then(async msgs => {
                            msgs.first().delete();
                            if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Cancelled the menu.`);
                            const key = msgs.first().content.toLowerCase().split(' ')[0];
                            if (key === 'enable') {
                                message.settings.leave_config.enabled = true;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully enabled your leave system.`);
                            } else if (key === 'disable') {
                                message.settings.leave_config.enabled = false;
                                this.client.settings.set(message.guild.id, message.settings);
                                return msg.edit(`${this.client.emotes.check} Successfully disabled your leave system.`);
                            } else if (key === 'channel') {
                                msg.edit('```What channel should your leave message be sent to?\nProvide a valid channel mention, name, or ID.```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    let channel = msgs.first().mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(msgs.first().content.toLowerCase())) || message.guild.channels.get(msgs.first().content);
                                    if (!channel) return msg.edit(`${this.client.emotes.x} Invalid channel provided.`);
                                    if (channel.type !== 'text') return msg.edit(`${this.client.emotes.x} The channel provided was not a text channel.`);
                                    message.settings.leave_config.channel = channel.id;
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your leave channel to ${channel.toString()}`);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else if (key === 'message') {
                                msg.edit('```What message should new users be greeted with?```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    if (msgs.first().content.length >= 2000) return msg.edit(`${this.client.emotes.x} leave messages should be less than 2,000 characters in length.`);
                                    message.settings.leave_config.message = msgs.first().content;
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your leave message to\`\`\`${message.settings.leave_config.message}\`\`\``);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else if (key === 'type') {
                                msg.edit('```What type of leave message do you want displayed? Valid options:\ntext (normal message)\nembed (displays in an embeded message)\ncanvas (canvas-generated image)```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    if (!['text', 'embed', 'canvas'].includes(msgs.first().content.toLowerCase())) return msg.edit(`${this.client.emotes.x} Invalid type provided.`);
                                    message.settings.leave_config.type = msgs.first().content.toLowerCase();
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your leave type to \`${message.settings.leave_config.type}\``);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else if (key === 'color') {
                                if (message.settings.leave_config.type !== 'embed') return msg.edit(`${this.client.emotes.x} You can only edit this setting if your leave type is set to '\`embed\`'`);
                                msg.edit('```What color should your leave-message embed be?```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    message.settings.leave_config.color = msgs.first().content;
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your leave color to \`${message.settings.leave_config.color}\``);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else if (key === 'footer') {
                                if (message.settings.leave_config.type !== 'embed') return msg.edit(`${this.client.emotes.x} You can only edit this setting if your leave type is set to '\`embed\`'`);
                                msg.edit('```What should the footer message be?```' + prompt);
                                message.channel.awaitMessages(filter, obj).then(msgs => {
                                    msgs.first().delete();
                                    if (msgs.first().content.toLowerCase() === 'cancel') return msg.edit(`${this.client.emotes.check} Successfully cancelled the menu.`);
                                    if (msgs.first().content.length >= 250) return msg.edit(`${this.client.emotes.x} Footer messages should be less than 250 characters in length.`);
                                    message.settings.leave_config.footer = msgs.first().content;
                                    this.client.settings.set(message.guild.id, message.settings);
                                    return msg.edit(`${this.client.emotes.check} Successfully set your leave footer message to\`\`\`${message.settings.leave_config.footer}\`\`\``);
                                }).catch(() => {
                                    return msg.edit(`${this.client.emotes.x} Timed out.`);
                                });
                            } else {
                                return msg.edit(`${this.client.emotes.x} Invalid type provided.`);
                            };
                        }).catch(() => {
                            return msg.edit(`${this.client.emotes.x} Timed out.`);
                        });
                    } else {
                        return msg.edit(`${this.client.emotes.x} Invalid option.`);
                    };
                }).catch(() => {
                    return msg.edit(`${this.client.emotes.x} Prompt timed-out.`);
                });
            } else if (flag === 'reset') {
                
            };
        })    
    };
   async ignored (message) {
        const users = [];
        const roles = [];
        const channels = [];
        for (let i = 0; i < message.settings.ignored.users.length; i++) {
            const user = await message.client.fetchUser(message.settings.ignored.users[i]);
            users.push(user.tag);
        };
       for (let i = 0; i < message.settings.ignored.roles.length; i++) {
          roles.push(message.guild.roles.get(message.settings.ignored.roles[i]).name);
       };
       for (let i = 0; i < message.settings.ignored.channels.length; i++) {
           channels.push(message.guild.channels.get(message.settings.ignored.channels[i]).name);
       };
       return { users: users, roles: roles, channels: channels };
    };

    handleChannel (type, message) {
        const { logging } = message.settings;
        if (!logging[type].enabled) return 'Not Set';
        let name = message.guild.channels.get(logging[type].channel);
        if (!name) return 'No Channel Set';
        name = name.name;
        return `#${name}`;    
    };
 };

 module.exports = Settings;
