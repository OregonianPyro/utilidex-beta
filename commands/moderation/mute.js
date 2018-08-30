const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
const ms = require('ms');

class Mute extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            category: 'moderation',
            description: 'Temporarily mutes a user.',
            usage: '{prefix}mute <@user|user ID> <time> <reason>',
            parameters: 'snowflakeGuildMember, integerTime, stringReason',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'KICK_MEMBERS',
            bot_permission: 'MANAGE_ROLES',
            aliases: ['tempmute']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'mute');
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return this.client.args(message, 'USER MENTION OR ID');
        if (member.user.id === message.author.id) return this.client.error(message, 'You cannot mute yourself.');
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition) {
            return this.client.error(message, 'You cannot mute someone that has a higher or equal role than you.');
        };
        let muterole;
        if (!message.guild.roles.get(message.settings.mute_role) || !message.settings.mute_role) {
            const role = await message.guild.createRole({
                name: 'Utilidex Muted',
                color: null,
                permissions: []
            });
            await message.guild.channels.forEach(c => {
                c.overwritePermissions(message.guild.roles.find(c => c.name === 'Utilidex Muted').id, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
            this.client.settings.setProp(message.guild.id, 'mute_role', message.guild.roles.find(r => r.name === 'Utilidex Muted').id);
            muterole = message.settings.mute_role;
        } else {
            muterole = message.settings.mute_role;
        };
        const time = args[1];
        if (!time) return this.client.args(message, 'TIME');
        if (isNaN(parseInt(time))) return this.client.error(message, 'Invalid time provided.');
        //if (!ms(time) < ms('8 days')) return this.client.error(message, 'Mutes cannot last longer than 7 days (one week)');
        const reason = args.slice(2).join(' ').length > 0 ? args.slice(2).join(' ') : 'No Reason Provided';
        message.delete();
        const embed = new RichEmbed()
            .setColor('000001')
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setTitle('User Muted')
            .setDescription(`**${member.user.username}** has been muted for ${ms(ms(time), { long: true })} by ${message.author.username}`)
            .addField('Reason', reason)
            .setThumbnail('https://goo.gl/9MmjZb');
        try {
            await member.addRole(muterole);
        } catch (e) {
            return this.client.error(message, `Error Muting | \`${e.message}\``), this.client.emit('error', e.stack);
        };
        await message.channel.send(member.toString(), embed);
        const obj = {
            case: message.cases.length,
            user: member.user.tag,
            id: member.user.id,
            moderator: message.author.tag,
            type: 'mute',
            duration: ms(ms(time), { long: true }),
            reason: reason,
            time: this.client.moment().format('LLLL')
        };
        this.client.cases.push(message.guild.id, obj);
        this.client.mod_history.push(`${message.guild.id}-${member.user.id}`, obj);
        this.client.mutes.push(message.guild.id, member.user.id);
        setTimeout(async () => {
            if (!this.client.mutes.get(message.guild.id).includes(member.user.id)) return;
            try {
                await member.removeRole(muterole);
            } catch (e) {
                return this.client.emit('error', e.stack);
            };
            const obj = {
                case: message.cases.length,
                user: member.user.tag,
                id: member.user.id,
                moderator: this.client.user.tag,
                type: 'unmute',
                reason: 'Mute Expired',
                time: this.client.moment().format('LLLL')
            };
            this.client.cases.push(message.guild.id, obj);
            this.client.mod_history.push(`${message.guild.id}-${member.user.id}`, obj);
            let index = this.client.mutes.get(message.guild.id).indexOf(member.user.id);
            this.client.mutes.get(message.guild.id).splice(index, 1);
        }, ms(time));
        if (!message.settings.logging.modlog.enabled) return;
        const modlog = message.guild.channels.get(message.settings.logging.modlog.channel);
        if (!modlog) return;
        const mute_log = new RichEmbed()
            .setColor('000001')
            .setAuthor(`${member.user.tag} | Mute`, member.user.displayAvatarURL)
            .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was muted for ${ms(ms(time, { long: true }))} by ${message.author.tag}`)
            .addField('Reason', reason)
            .setFooter(`Case #${message.cases.length - 1} | ${this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A')}`, message.author.displayAvatarURL);
        modlog.send(mute_log);
        setTimeout(() => {
            if (!this.client.mutes.get(message.guild.id).includes(member.user.id)) return;
            const unmute_log = new RichEmbed()
                .setColor('000001')
                .setAuthor(`${member.user.tag} | Unmute`, member.user.displayAvatarURL)
                .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was unmuted by ${this.client.user.tag}`)
                .addField('Reason', 'Mute Expired')
                .setFooter(`Case #${message.cases.length} | ${this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A')}`, this.client.user.displayAvatarURL);
            modlog.send(unmute_log);
        }, ms(time));
    };
};

module.exports = Mute;
