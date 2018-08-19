const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

class Case extends Command {
    constructor(client) {
        super(client, {
            name: 'case',
            category: 'moderation',
            description: 'Fetches case details for a previous moderation case.',
            usage: '{prefix}case <#casenum|casenum>',
            parameters: 'integerCaseNum',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'KICK_MEMBERS',
            bot_permission: 'EMBED_LINKS',
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'case');
        if (message.cases.length < 0) return message.channel.send(`${this.client.emotes.x} This server does not have any moderation cases.`);
        const casenum = message.content.includes('#') ? message.content.split('#')[1] : args[0];
        if (isNaN(parseInt(casenum))) return message.channel.send(`${this.client.emotes.x} Invalid case number.`);
        if (!message.cases[casenum]) return message.channel.send(`${this.client.emotes.x} No case could be retrieved.`);
        const Case = message.cases[casenum];
        let color;
        if (Case.type === 'warn') color = 'GOLD';
        if (Case.type === 'mute' || Case.type === 'unmute') color = 'GREY';
        if (Case.type === 'kick') color = 'ORANGE';
        if (Case.type === 'softban' || Case.type === 'tempban' || Case.type === 'ban' || Case.type === 'hardban') color = 'RED';
        if (Case.type === 'unban') color = 'GREEN';
        const embed = new RichEmbed()
            .setColor(color)
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`Successfully fetched case details for case number \`${casenum}\``)
            .addField('Type', Case.type.split('')[0].toUpperCase() + Case.type.split('').slice(1).join(''))
            .addField('User', Case.user)
            .addField('Moderator', Case.moderator)
            .addField('Timestamp', Case.time)
            .addField('Reason', `\`\`\`${Case.reason}\`\`\``);
        if (!Case.hasOwnProperty('duration')) return message.channel.send(embed);
        embed.addField('Duration', Case.duration);
        return message.channel.send(embed);
    };
};

module.exports = Case;