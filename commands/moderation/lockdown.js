const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
const ms = require('ms');

class Lockdown extends Command {
    constructor(client) {
        super(client, {
            name: 'lockdown',
            category: 'moderation',
            description: 'Locks the current channel, or locks the server preventy anyone from speaking.',
            usage: '{prefix}lockdown [-g|-global]',
            parameters: 'stringFlag',
            extended: true,
            extended_help: 'Adding the `-g` or `-global` flag will change your guild\'s verification level to `high`.\nNote: The `-g` flag will only work if you no autorole (on any bots) is enabled.',
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_GUILD',
            bot_permission: 'ADMINISTRATOR',
            aliases: ['lock']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'lockdown');
        //u!lockdown 3m -g
        //[command] [0] [1];
        const time = args[0];
        if (isNaN(parseInt(ms(time)))) return this.client.error(message, 'Invalid time provided.');
        if (ms(parseInt(time)) >= ms('3 days')) return this.client.error(message, 'Lockdowns cannot exceed 3 days.');
        let global;
        let reason;
        if (!args[1] || !message.content.includes('-')) global = false;
        if (args[1] && message.content.includes('-') && message.content.split('-')[1].includes('g' || 'global')) global = true;
        message.delete();
        if (global) {
            if (args.slice(1).join(' ').split('-')[0].length < 0) reason = 'No Reason Provided';
            reason = args.slice(1).join(' ').split('-')[0].join(' ');
            let level = message.guild.verificationLevel;
            try {
                await message.guild.setVerificationLevel(4, 'Global Lockdown');
            } catch (e) {
                return this.client.error(message, `Error Locking: ${e.message}`);
            };
            const embed = new RichEmbed()
                .setColor('DARK_ORANGE')
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setTitle('Server Locked')
                .setDescription(`'${message.guild.name}' has been locked for **${ms(ms(time), { long: true })}** by ${message.author.username}`)
                .addField('Reason', reason)
            message.channel.send(embed);
            //if (!this.client.locks.includes(message.guild.id)) return;
            setTimeout(() => {
                message.guild.setVerificationLevel(level, 'Lockdown Ended');
                const embed = new RichEmbed()
                    .setColor('DARK_ORANGE')
                    .setAuthor(message.author.username, message.author.displayAvatarURL)
                    .setTitle('Server Unlocked')
                    .setDescription(`'${message.guild.name}' has been unlocked by ${this.client.user.username}`)
                    .addField('Reason', 'Lockdown Ended');
                message.channel.send(embed);
            }, ms(time));
            if (!message.settings.logging.modlog.enabled) return;
            const log = message.guild.channels.get(message.settings.logging.modlog.channel);
            if (!log) return;
            const lock_log = new RichEmbed()
                .setColor('DARK_ORANGE')
                .setAuthor(`${message.guild.name} | Global Lockdown`)
                .setDescription(`**${message.author.tag}** (\`${message.author.id}\`) locked ${message.guild.name} for ${ms(ms(time), { long: true })}`)
                .addField('Reason', reason)
                .setTimestamp();
            log.send(lock_log);
            setTimeout(() => {
                const unlock_log = new RichEmbed()
                    .setColor('DARK_ORANGE')
                    .setAuthor(`${message.guild.name} | Global Unlock`)
                    .setDescription(`**${this.client.user.tag}** (\`${this.client.user.id}\`) unlocked ${message.guild.name}`)
                    .addField('Reason', 'Lockdown Ended')
                    .setTimestamp();
                log.send(unlock_log);
            }, ms(time));
        } else {
            reason = args.slice(1).join(' ').length > 0 ? args.slice(1).join(' ') : 'No Reason Provided';
            try {
                await message.channel.overwritePermissions(message.guild.id, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            } catch (e) {
                return this.client.error(message, `Error Locking: ${e.message}`);
            };
            const embed = new RichEmbed()
                .setColor('DARK_ORANGE')
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setTitle('Channel Locked')
                .setDescription(`${message.channel} has been locked for **${ms(ms(time), { long: true })}** by ${message.author.username}`)
                .addField('Reason', reason)
            message.channel.send(embed);
            //if (!this.client.locks.includes(message.channel.id)) return;
            setTimeout(async () => {
                await message.channel.overwritePermissions(message.guild.id, {
                    SEND_MESSAGES: true,
                    ADD_REACTIONS: true
                });
                const embed = new RichEmbed()
                    .setColor('DARK_ORANGE')
                    .setAuthor(message.author.username, message.author.displayAvatarURL)
                    .setTitle('Channel Unlocked')
                    .setDescription(`${message.channel} has been unlocked by ${this.client.user.username}`)
                    .addField('Reason', 'Lockdown Ended');
                message.channel.send(embed);
            }, ms(time));
            if (!message.settings.logging.modlog.enabled) return;
            const log = message.guild.channels.get(message.settings.logging.modlog.channel);
            if (!log) return;
            const lock_log = new RichEmbed()
                .setColor('DARK_ORANGE')
                .setAuthor(`${message.guild.name} | Lockdown`)
                .setDescription(`**${message.author.tag}** (\`${message.author.id}\`) locked ${message.channel} for ${ms(ms(time), { long: true })}`)
                .addField('Reason', reason)
                .setTimestamp();
            log.send(lock_log);
            setTimeout(() => {
                const unlock_log = new RichEmbed()
                    .setColor('DARK_ORANGE')
                    .setAuthor(`${message.guild.name} | Unlock`)
                    .setDescription(`**${this.client.user.tag}** (\`${this.client.user.id}\`) unlocked ${message.channel}`)
                    .addField('Reason', 'Lockdown Ended')
                    .setTimestamp();
                log.send(unlock_log);
            }, ms(time));
        };
    };
};

module.exports = Lockdown;
