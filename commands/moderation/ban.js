const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
const { ban } = require('../../modules/moderation/dm.js');

class Ban extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            category: 'moderation',
            description: 'Bans a user from the server.',
            usage: '{prefix}ban <@user|user ID> <reason>',
            parameters: 'snowflakeGuildMember, stringReason',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'BAN_MEMBERS',
            bot_permission: 'BAN_MEMBERS',
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'ban');
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return this.client.args(message, 'USER MENTION OR ID');
        if (member.user.id === message.author.id) {
            return message.delete(), message.channel.send(`${this.client.emotes.x} Really, you think I'm going to let you ban yourself?`);
        };
        if (member.user.id === this.client.user.id) {
            return message.delete(), message.channel.send(`${this.client.emotes.x} Nice try, but you can't ban me using me.`);
        };
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition) {
            return message.delete(), message.channel.send(`${this.client.emotes.x} That user cannot be moderated as they have a higher or equal role than the bot's highest role.`);
        };
        const reason = args.slice(1).join(' ').length > 1 ? args.slice(1).join(' ') : 'No Reason Provided';
        message.delete();
        ban(message, member, reason);
        const embed = new RichEmbed()
            .setColor('RED')
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setTitle('User Banned')
            .setDescription(`**${member.user.username}** has been banned by ${message.author.username}`)
            .addField('Reason', reason)
            .setThumbnail('https://vignette.wikia.nocookie.net/the-zula-patrol/images/6/62/Red_X_icon.png/revision/latest?cb=20150702044511');
        message.channel.send(member.toString(), embed);
        try {
            await member.ban(`Banned by ${message.author.tag} | Reason: ${reason}`);
        } catch (e) {
            this.client.emit('error', e.stack);
            throw new Error(e.message);
        };
        if (!this.client.mod_history.has(`${message.guild.id}-${member.user.id}`)) this.client.mod_history.set(`${message.guild.id}-${member.user.id}`, []);
        if (!this.client.cases.has(message.guild.id)) this.client.cases.set(message.guild.id, []);
        let obj = {
            case: this.client.cases.get(message.guild.id).length > 0 ? this.client.cases.get(message.guild.id).length : 1,
            user: member.user.tag,
            moderator: message.author.tag,
            type: 'ban9',
            reason: reason,
            time: this.client.moment().format('LLLL')
        };
        this.client.cases.get(message.guild.id).push(obj);
        this.client.mod_history.get(`${message.guild.id}-${member.user.id}`).push(obj);
        this.client.cases.set(message.guild.id, this.client.cases.get(message.guild.id));
        this.client.mod_history.set(`${message.guild.id}-${member.user.id}`, this.client.mod_history.get(`${message.guild.id}-${member.user.id}`));
        if (!message.settings.logging.modlog.enabled) return;
        const modlog = message.guild.channels.find(c => c.name === message.settings.logging.modlog.channel) || message.guild.channels.get(message.settings.logging.modlog.channel);
        if (!modlog) return;
        const log_embed = new RichEmbed()
            .setAuthor(`${member.user.tag} | Ban`, member.user.displayAvatarURL)
            .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was banned by ${message.author.tag}`)
            .addField('Reason', reason)
            .setFooter(`Case #${this.client.cases.get(message.guild.id).length} | ${this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A')}`, message.author.displayAvatarURL)
            .setColor('RED');
        return modlog.send(log_embed);
    };
};

module.exports = Ban;