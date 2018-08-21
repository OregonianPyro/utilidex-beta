const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
const { kick } = require('../../modules/moderation/dm.js');

class Kick extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            category: 'moderation',
            description: 'Kicks a user from the server.',
            usage: '{prefix}kick <@user|user ID> <reason>',
            parameters: 'snowflakeGuildMember, stringReason',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'KICK_MEMBERS',
            bot_permission: 'KICK_MEMBERS',
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'kick');
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return this.client.args(message, 'USER MENTION OR ID');
        if (member.user.id === message.author.id) {
            return message.delete(), message.channel.send(`${this.client.emotes.x} Really, you think I'm going to let you kick yourself?`);
        };
        if (member.user.id === this.client.user.id) {
            return message.delete(), message.channel.send(`${this.client.emotes.x} Nice try, but you can't kick me using me.`);
        };
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition) {
            return message.delete(), message.channel.send(`${this.client.emotes.x} That user cannot be moderated as they have a higher or equal role than the bot's highest role.`);
        };
        const reason = args.slice(1).join(' ').length > 1 ? args.slice(1).join(' ') : 'No Reason Provided';
        message.delete();
        kick(message, member, reason);
        const embed = new RichEmbed()
            .setColor('ORANGE')
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setTitle('User Kicked')
            .setDescription(`**${member.user.username}** has been kicked by ${message.author.username}`)
            .addField('Reason', reason)
            .setThumbnail('https://images-ext-2.discordapp.net/external/mgW9zgBY_2k1Byk_VdBLNkEHI0WjeH8qxJiG62idkIo/https/cdn.discordapp.com/emojis/369196970289528845.png');
        message.channel.send(member.toString(), embed);
        try {
            await member.kick(`Kicked by ${message.author.tag} | Reason: ${reason}`);
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
            type: 'kick',
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
            .setAuthor(`${member.user.tag} | Kick`, member.user.displayAvatarURL)
            .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was kicked by ${message.author.tag}`)
            .addField('Reason', reason)
            .setFooter(`Case #${this.client.cases.get(message.guild.id).length - 1} | ${this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A')}`, message.author.displayAvatarURL)
            .setColor('ORANGE');
        return modlog.send(log_embed);
    };
};

module.exports = Kick;