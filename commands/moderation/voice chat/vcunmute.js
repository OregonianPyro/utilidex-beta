const { RichEmbed } = require('discord.js');
const Command = require('../../../base/command.js');

class VCUnmute extends Command {
    constructor(client) {
        super(client, {
            name: 'vcunmute',
            category: 'moderation',
            description: 'Unmutes a muted a user in all voice chats.',
            usage: '{prefix}unmute <@user|user ID> [reason]',
            parameters: 'snowflakeGuildMember, stringReason',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MUTE_MEMBERS',
            bot_permission: 'MUTE_MEMBERS',
            aliases: ['vcum']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'vcunmute');
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member) return this.client.error(message, 'Please provide a valid user mention or ID.');
        if (!member.voiceChannel) return this.client.error(message, 'This member is not in a voice channel.');
        if (!member.serverMute) return this.client.error(message, 'That user is not muted.');
        const reason = args.slice(1).join(' ').length > 0 ? args.slice(1).join(' ') : 'No Reason Provided';
        message.delete();
        try {
            await member.setMute(false, `Unmuted by ${message.author.tag} | Reason: ${reason}`);
        } catch (e) {
            return console.error, this.client.error(message, `Error: \`${e.message}\``);
        };
        message.channel.send(`${member.toString()} has been \`🔈\` unmuted in all voice channels by ${message.author.tag}\`\`\`${reason}\`\`\``);
        const key = `${message.guild.id}-${member.user.id}`;
        if (!this.client.mod_history.has(key)) this.client.mod_history.set(key, []);
        if (!this.client.cases.has(message.guild.id)) this.client.cases.set(message.guild.id, []);
        const obj = {
            case: this.client.cases.get(message.guild.id).length == 1 ? 1 : this.client.cases.get(message.guild.id).length - 1,
            user: member.user.tag,
            ID: member.user.id,
            moderator: message.author.tag,
            type: 'voice chat unmute',
            reason: reason,
            time: this.client.moment().format('LLLL'),
            edits: []
        };
        await this.client.cases.push(message.guild.id, obj);
        await this.client.mod_history.push(key, obj);
        if (!message.settings.logging.modlog.enabled) return;
        if (!message.guild.channels.get(message.settings.logging.modlog.channel)) return;
        if (!message.guild.channels.get(message.settings.logging.modlog.channel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
        if (!message.guild.channels.get(message.settings.logging.modlog.channel).permissionsFor(message.guild.me).has('EMBED_LINKS')) return;
        const modLog = new RichEmbed()
            .setColor('GREY')
            .setAuthor(`${member.user.tag} | Voice-Chat Unmute`, member.user.displayAvatarURL)
            .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was unmuted in all voice chats by ${message.author.tag}`)
            .addField('Reason', reason)
            .setFooter(`Case #${this.client.cases.get(message.guild.id).length == 1 ? 1 : this.client.cases.get(message.guild.id).length - 1} | ${this.client.moment().format('dddd, MMMM Do, YYYY, hh:mm:ss A')}`, message.author.displayAvatarURL)
        return message.guild.channels.get(message.settings.logging.modlog.channel).send(modLog);
    };
};

module.exports = VCUnmute;