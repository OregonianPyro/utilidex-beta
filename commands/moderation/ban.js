const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
const ms = require('ms');
const { ban } = require('../../modules/moderation/dm.js');
const { tempban } = require('../../modules/moderation/dm.js');

class Ban extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            description: 'Bans a member from the server. Optional \'soft ban\', temp-ban, or \'hard ban\' methods.',
            usage: '{prefix}ban <@user|user ID> <reason> [--type] -[options]:[option]',
            parameters: 'snowflakeGuildMember, stringReason, stringType, stringOptions, stringOption',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'BAN_MEMBERS',
            bot_permission: 'BAN_MEMBERS',
            aliases: ['permban']
        });
    };

    async run(message, args) {
        /**
         * u!ban @user spam
         * u!ban @user spam --s|oft -d:3
         * u!ban @user spam --temp -t:1wk
         * u!ban @user spam --hard
         */
        if(!args[0]) return this.client.help(this.client, message, 'ban');
        let member = message.mentions.users.first() || this.client.users.get(args[0]) || await this.client.fetchUser(args[0]);
        if (!member) return this.client.error(message, 'That user doest not exist.');
        member = message.guild.members.get(member.id);
        if (!member) return this.client.args(messae, 'USER MENTION OR ID');
        let key = `${message.guild.id}-${member.user.id}`;
        let flag;
        let days;
        let time;
        let reason;
        if (!message.content.includes('--')) {
            flag = 'normal';
        } else {
            let type = message.content.split('--')[1];
            if (!['soft', 'hard', 'temp'].includes(type.split(' ')[0].toLowerCase())) flag = 'normal';
            if (type.split(' ')[0].toLowerCase() === 'soft') {
                flag = 'soft';
                let split = type.split(' ')[1];
                if (!split.includes('-d:')) days = 1;
                split = split.split(':')[1] > 0 && split.split(':')[1] < 8 ? split.split(':')[1] : 1;
                days = split;
            } else if (type.split(' ')[0].toLowerCase() === 'hard') {
                flag = 'hard';
                days = 7;
            } else if (type.split(' ')[0].toLowerCase() === 'temp') {
                flag = 'temp';
                let split = type.split(' ')[1];
                if (!split.includes('-t:')) return this.client.args(message, 'TIME');
                if (isNaN(parseInt(ms(split.split(':')[1])))) return this.client.error(message, 'Invalid time provided.');
                if (ms(split.split(':')[1]) >= ms('3 weeks')) return this.client.error(message, 'Bans cannot be longer than 3 weeks.');
                time = split.split(':')[1];
            };
        };
        if (flag === 'normal') reason = args.slice(1).join(' ').length > 0 ? args.slice(1).join(' ') : 'No Reason Provided';
        if (['soft', 'hard', 'temp'].includes(flag)) {
            let split = message.content.split(' ');
            split = split.slice(2).join(' ').split('--')[0];
            reason = split.length > 0 ? split : 'No Reason Provided';
        };
        if (flag === 'normal') {
            message.delete();
            const embed = new RichEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setTitle('User Banned')
                .setDescription(`**${member.user.username}** has been banned by ${message.author.username}`)
                .addField('Reason', reason)
                .setColor('RED')
                .setThumbnail('https://goo.gl/35DMwK');
            try {
                await ban(message, member, reason);
            } catch (e) {
                console.log(e.message);
            };
            message.channel.send(member.toString(), embed);
            try {
                await member.ban(`Banned by ${message.author.tag} | Reason: ${reason}`);
            } catch (e) {
                return this.client.error(message, e.message), console.error(e.stack);
            };
            if (!this.client.mod_history.has(key)) this.client.mod_history.set(key, []);
            const obj = {
                case: this.client.cases.get(message.guild.id).length > 0 ? this.client.cases.get(message.guild.id).length : 1,
                user: member.user.tag,
                ID: member.user.id,
                moderator: message.author.tag,
                type: 'ban',
                reason: reason,
                time: this.client.moment().format('LLLL')
            };
            this.client.mod_history.get(key).push(obj);
            this.client.mod_history.set(key, this.client.mod_history.get(key));
            this.client.cases.get(message.guild.id).push(obj);
            this.client.cases.set(message.guild.id, this.client.cases.get(message.guild.id));
            if (!message.settings.logging.modlog.enabled) return;
            if (!message.guild.channels.get(message.settings.logging.modlog.channel)) return;
            const ban_log = new RichEmbed()
                .setColor('RED')
                .setAuthor(`${member.user.tag} | Ban`, member.user.displayAvatarURL)
                .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was banned by ${message.author.tag}`)
                .addField('Reason', reason)
                .setFooter(`Case #${this.client.cases.get(message.guild.id).length - 1} | ${this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A')}`, message.author.displayAvatarURL)
            return message.guild.channels.get(message.settings.logging.modlog.channel).send(ban_log);
        } else if (flag === 'soft') {
            message.delete();
            const embed = new RichEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setTitle('User Banned')
                .setDescription(`**${member.user.username}** has been soft-banned by ${message.author.username}`)
                .addField('Reason', reason)
                .setColor('RED')
                .setThumbnail('https://goo.gl/35DMwK');
            try {
                await ban(message, member, reason);
            } catch (e) {
                console.log(e.message);
            };
            message.channel.send(member.toString(), embed);
            try {
                await member.ban({
                    days: days,
                    reason: `Banned by ${message.author.tag} | Reason: ${reason}`
                });
            } catch (e) {
                return this.client.error(message, e.message), console.error(e.stack);
            };
            if (!this.client.mod_history.has(key)) this.client.mod_history.set(key, []);
            const obj = {
                case: this.client.cases.get(message.guild.id).length > 0 ? this.client.cases.get(message.guild.id).length : 1,
                user: member.user.tag,
                ID: member.user.id,
                moderator: message.author.tag,
                type: 'ban',
                reason: reason,
                time: this.client.moment().format('LLLL')
            };
            this.client.mod_history.get(key).push(obj);
            this.client.mod_history.set(key, this.client.mod_history.get(key));
            this.client.cases.get(message.guild.id).push(obj);
            this.client.cases.set(message.guild.id, this.client.cases.get(message.guild.id));
            setTimeout(async () => {
                try {
                    await message.guild.unban(member.user.id, 'Soft-Ban Expired');
                } catch (e) {
                    return this.client.error(message, e.message), console.error(e.stack);
                };
                const obj = {
                    case: this.client.cases.get(message.guild.id).length > 0 ? this.client.cases.get(message.guild.id).length : 1,
                    user: member.user.tag,
                    ID: member.user.id,
                    moderator: this.client.user.tag,
                    type: 'unban',
                    reason: 'Soft-Ban Expred',
                    time: this.client.moment().format('LLLL')
                };
                this.client.mod_history.get(key).push(obj);
                this.client.mod_history.set(key, this.client.mod_history.get(key));
                this.client.cases.get(message.guild.id).push(obj);
                this.client.cases.set(message.guild.id, this.client.cases.get(message.guild.id));
            }, (5000));
            if (!message.settings.logging.modlog.enabled) return;
            if (!message.guild.channels.get(message.settings.logging.modlog.channel)) return;
            const ban_log = new RichEmbed()
                .setColor('RED')
                .setAuthor(`${member.user.tag} | Soft-Ban`, member.user.displayAvatarURL)
                .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was soft-banned by ${message.author.tag}`)
                .addField('Reason', reason)
                .setFooter(`Case #${this.client.cases.get(message.guild.id).length - 1} | ${this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A')}`, message.author.displayAvatarURL)
            message.guild.channels.get(message.settings.logging.modlog.channel).send(ban_log);
            setTimeout(() => {
                const unban_log = new RichEmbed()
                    .setColor('GREEN')
                    .setAuthor(`${member.user.tag} | Unban`, member.user.displayAvatarURL)
                    .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was unbanned by ${this.client.user.tag}`)
                    .addField('Reason', 'Soft-Ban Expired')
                    .setFooter(`Case #${this.client.cases.get(message.guild.id).length} | ${this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A')}`, message.author.displayAvatarURL)
                message.guild.channels.get(message.settings.logging.modlog.channel).send(unban_log);
                }, (5000));
            return;
        } else if (flag === 'hard') {

        } else if (flag === 'temp') {

        };
    };
};  

module.exports = Ban;
