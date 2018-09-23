const { RichEmbed } = require('discord.js');
const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/ig;
const tag_check = require('../functions/tag_check.js');

module.exports = class {
    constructor(client) {
        this.client = client;
    };

    async run(message) {
        const prefixMention = new RegExp(`^<@!?${this.client.user.id}>`);
        message.settings = message.guild ? this.client.settings.get(message.guild.id) : this.client.default_settings;
        message.cases = message.guild ? this.client.cases.get(message.guild.id) : 0;
        message.tags = message.guild ? (this.client.tags.has(message.guild.id) ? this.client.tags.get(message.guild.id) : this.client.tags.set(message.guild.id, [])) : '';
        if (message.author.bot) return;
        if (message.channel.type !== 'text') return;
        if (message.attachments.size > 0) {
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(message.author.username, message.author.displayAvatarURL, message.attachments.first().url)
                .setDescription(`${message.author.tag} posted an image in ${message.channel.toString()}`)
                .addField('Message Content', message.content.length > 0 ? message.content : 'No Content')
                .addField('File Details', `File Name: \`${message.attachments.first().filename}\`\nFile Size: \`${message.attachments.first().filesize}\``)
                .setImage(message.attachments.first().url)
                .setFooter('Click the author\'s name at the top of the embed if the image does not display.');
            const log = message.guild.channels.find(c => c.name === message.settings.logging.imagelog.channel) || message.guild.channels.get(message.settings.logging.imagelog.channel);
            if (!log || !message.settings.logging.imagelog.enabled) return;
            return log.send(embed);
        };
        if (message.content.match(this.prefixMention) && message.content.toLowerCase().includes('prefix')) {
            return message.channel.send(`The prefix for __${message.guild.name}__ is \`${message.settings.prefix}\``);
        };
        const prefix = message.settings.prefix;
        if (message.content.indexOf(prefix) !== 0) return;
        // const args = message.content.slice(prefix.length).trim().split(/ +/g);
        let args = message.content.split(' ').slice(1);
        return require('../functions/run_command.js')(message, args);
    };
};
