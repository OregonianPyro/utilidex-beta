
const { RichEmbed } = require('discord.js');
const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/ig;
const tag_check = require('../functions/tag_check.js');

module.exports = class {
    constructor(client) {
        this.client = client;
    };

    async run(message) {
        const prefixMention = new RegExp(`^<@!?${this.client.user.id}>`);
        if (!this.client.settings.has(message.guild.id)) this.client.settings.set(message.guild.id, this.client.default_settings);
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
        // if (message.content.match(this.prefixMention)) {
        //     return message.channel.send(`The prefix for __${message.guild.name}__ is \`${message.settings.prefix}\``);
        // };
        const afk = await this.isAFK(message);
        if (['string', 'object'].includes(typeof(afk))) {
            return message.channel.send(afk);
        };
        const prefix = message.settings.prefix;
        if (message.content.indexOf(prefix) !== 0) return;
        // const args = message.content.slice(prefix.length).trim().split(/ +/g);
        let args = message.content.split(' ').slice(1);
        return require('../functions/run_command.js')(message, args);
    };

    async isAFK(message) {
        let res;
        let client = message.client;
        if (!message.content.match(/<@!?(1|\d{17,19})>/)) return res = false;
        if (client.AFK.get(message.guild.id).length < 1) return res = false;
        for (let i = 0; i < client.AFK.get(message.guild.id).length; i++) {
            if (client.AFK.get(message.guild.id)[i].id !== message.content.match(/<@!?(1|\d{17,19})>/)[1]) return res = false;
            if (client.AFK.get(message.guild.id)[i].id === message.content.match(/<@!?(1|\d{17,19})>/)[1]) {
                let getter = client.AFK.get(message.guild.id)[i];
                if (message.channel.permissionsFor(client.user.id).has('EMBED_LINKS')) {
                    const user = await client.fetchUser(getter.id);
                    res = new RichEmbed()
                        .setColor('BLUE')
                        .setAuthor(user.username, user.displayAvatarURL)
                        .setDescription(`${getter.tag} is currently AFK with the following message:\`\`\`${getter.message}\`\`\`AFK Since: __${client.moment(getter.timestamp).fromNow()}__`)
                } else {
                    res = `${getter.tag} is AFK: \`${getter.message}\` - **${client.moment(getter.timestamp).fromNow()}**`;
                };
            };
        };
        return res;
    };
};
