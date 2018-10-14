const Command = require('../../base/command.js');
const { RichEmbed, Attachment } = require('discord.js');

class Emote extends Command {
    constructor(client) {
        super(client, {
            name: 'emote',
            category: 'utility',
            description: 'Retrieves information for a custom emote in the current server.',
            usage: '{prefix}emote <:emote:|emote name> [--large|--i|--icon|--image]',
            parameters: 'snowflakeGuildEmoji, stringFlag',
            extended: true,
            extended_help: 'By adding `--large`, `--i`, `--icon`, or `--image`, the bot will send a larger version of the emote.',
            enabled: true,
            reason: false,
            devOnly: false,
            guildOnly: true,
            permission: 'SEND_MESSAGES',
            bot_permission: 'MANAGE_EMOJIS',
            aliases: ['emoji']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'emote');
        let emote = args[0].includes(':') ? args[0].split(':')[1].split(':')[0] : args[0];
        emote = message.guild.emojis.find(e => e.name.toLowerCase() === emote.toLowerCase()) || message.guild.emojis.get(emote);
        if (!emote) return this.client.error(message, 'It seems that emoji does not exist in this server.');
        let large;
        if (!args[1]) large = false;
        if (args[1] && ['--large', '--i', '--icon', '--image'].includes(args[1].toLowerCase())) large = true;
        if (!large) {
            const obj = {
                name: emote.name,
                animated: emote.animated ? 'Animated' : 'Not Animated',
                created: `${this.client.moment(emote.createdAt).format('dddd, MMMM Do, YYYY, hh:mm:ss A')}\n(${this.client.moment(emote.createdAt).fromNow()})`,
                identifier: emote.identifier,
                url: emote.url,
            };
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(message.guild.name, message.guild.iconURL)
                .setThumbnail(obj.url)
                .setDescription(`» Name: **${obj.name}**\n» Identifier: \`<${obj.identifier}>\`\n» Animated: ${obj.animated}`);
            return message.channel.send(embed);
        } else if (large) {
            const msg = await message.channel.send('Generating...');
            const image = await this.client.API.brightness(emote.url, 0);
            await message.channel.send(await new Attachment(
                image, 'large-emoji.png'
            ));
            return msg.delete();
        };
    };
};

module.exports = Emote;
