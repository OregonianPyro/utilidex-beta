const { RichEmbed } = require('discord.js');
const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/ig;

class Message {
    constructor(client) {
        this.client = client;
    };

    async run(message) {        
        message.settings = message.guild ? this.client.settings.get(message.guild.id) : this.client.default_settings;
        message.cases = message.guild ? this.client.cases.get(message.guild.id) : 0;
        if (message.author.bot) return;
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
        if (regex.test(message.content)) return require('../automod/invite_links.js')(message);
        if (message.content.indexOf(message.settings.prefix) !== 0) return;
        const args = message.content.split(' ').slice(1);
        let command = message.content.split(' ')[0];
        command = command.slice(message.settings.prefix.length).toLowerCase();
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;
        if (!message.guild && cmd.conf.guildOnly) return message.channel.send(`${this.client.emotes.x} This command cannot be ran in DMs.`);
        if (!message.guild && !cmd.conf.guildOnly) {
            try {
                await cmd.run(message, args);
            } catch (e) {
                const embed = new RichEmbed()
                    .setColor('RED')
                    .setTitle('Command Error')
                    .setDescription(`$0{this.client.emotes.x} Something went wrong trying to execute that command:\`\`\`${e.message}\`\`\``);
                message.delete(), message.channel.send(embed);
                console.error(this.client.chalk.bgBlack.redBright(e.stack));
            };
        };
        if (!message.member.permissions.has(cmd.conf.permission)) return message.reply('cant use that!');
        if (!message.guild.me.permissions.has(cmd.conf.bot_permission)) return message.reply(`the bot lacks the permission \`${cmd.conf.bot_permission}\``);
        try {
            await cmd.run(message, args);
        } catch (e) {
            const embed = new RichEmbed()
                .setColor('RED')
                .setTitle('Command Error')
                .setDescription(`${this.client.emotes.x} Something went wrong trying to execute that command:\`\`\`${e.message}\`\`\``);
            message.delete(), message.channel.send(embed);
            console.error(this.client.chalk.bgBlack.redBright(e.stack));
        };
    };
};

module.exports = Message;