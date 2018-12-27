const { MessageEmbed } = require('discord.js');

module.exports = class {
    constructor(client) {
        this.client = client;
    };

    async run(message) {
        if (message.channel.type !== 'text') return;
        if (message.author.bot) return;
        this.client.store.guildData.ensure(message.guild.id, this.client.defaultGuildData);
        // if (!this.client.store.permNodes.has(message.guild.id)) {
        //     this.client.store.permNodes.set(message.guild.id, { enabled: true });
        //     const _DB = this.client.store.permNodes.get(message.guild.id);
        //     message.guild.members.forEach(u => _DB.set(u.user.id, {
        //         botOwner: [],
        //         General: [],
        //         Moderation: [],
        //         Utility: [],
        //         Fun: [],
        //         Fun_Image: []
        //     }));
        // };
        message.settings = this.client.store.guildData.get(message.guild.id);
        message.responder = {
            error: (err, embed = false) => {
                if (!embed) return message.channel.send(`${this.client.store.emotes.x} ${err}`);
                return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`${this.client.store.emotes.x} ${err}`));
            },
            success: (msg, embed = false) => {
                if (!embed) return message.channel.send(`${this.client.store.emotes.check} ${msg}`);
                return message.channel.send(new MessageEmbed().setColor('GREEN').setDescription(`${this.client.store.emotes.check} ${msg}`));
            },
            warn: (msg, embed = false) => {
                if (!embed) return message.channel.send(`${this.client.store.emotes.warn} ${msg}`);
                return message.channel.send(new MessageEmbed().setColor('GOLD').setDescription(`${this.client.store.emotes.warn} ${msg}`));
            },
            embed: (data = {}) => {
                const embed = new MessageEmbed();
                const addFields = async (fieldsArray) => {
                    for (let i = 0; i < fieldsArray.length; i++) {
                        if (!fieldsArray[i].name || !fieldsArray[i].value) continue;
                        embed.addField(fieldsArray[i].name, fieldsArray[i].value, fieldsArray[i].inline ? true : false);
                    };
                };
                data.hasOwnProperty('authorName') && data.hasOwnProperty('authorURL') ? embed.setAuthor(data.authorName, data.authorURL) : null;
                data.hasOwnProperty('color') ? embed.setColor(data.color) : embed.setColor(message.guild.me.displayHexColor);
                data.hasOwnProperty('title') ? embed.setTitle(data.title) : null;
                data.hasOwnProperty('fields') ? (data.fields.length > 0 ? addFields(data.fields) : null) : null;
                data.hasOwnProperty('thumbnail') ? embed.setThumbnail(data.thumbnail) : null;
                data.hasOwnProperty('image') ? embed.setImage(data.image) : null;
                data.hasOwnProperty('footer') && data.hasOwnProperty('footerURL') ? embed.setFooter(data.footer, data.footerURL) : null;
                data.hasOwnProperty('description') ? embed.setDescription(data.description) : null;
                return message.channel.send(embed);
            }
        };
        /*
        automod
        */
        const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|\\${message.settings.prefix})\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [ , matchedPrefix ] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const argsShift = args.shift().toLowerCase();
        const command = this.client.commands.get(argsShift) || this.client.commands.get(this.client.aliases.get(argsShift));
        if (!command) {
            if (!this.client.store.tags.has(`${message.guild.id}-${argsShift}`)) return;
            return message.channel.send(this.client.store.tags.get(`${message.guild.id}-${argsShift}`));
        };
        if (this.client.store.blacklistedUsers.includes(message.author.id)) return;
        this.client.store.disabledCommands.forEach(i => {
            if (i.split('-')[0].toLowerCase() === command) {
                return message.responder.error(`This command has been disabled globally by the bot developer.\n\n**Reason: \`${i.split('-')[1]}\`**`, true);
            };
        });
        if (command.conf.devOnly && message.author.id !== '312358298667974656') {
            return message.responder.error('This command can only be ran by the bot owner.', true);
        };
        if (command.conf.supportOnly && !this.client.store.supportStaff.includes(message.author.id)) {
            return message.responder.error('This command can only be ran by the bot support staff.', true);
        };
        const [ userPerm, botPerm ] = command.conf.perms;
        if (!message.member.permissions.has(userPerm)) return message.responder.error(`This command requires that you have the \`${userPerm}\` permission.`, true);
        if (!message.guild.me.permissions.has(botPerm)) return message.responder.error(`Failed to execute the command because the bot lack the permission \`${botPerm}\``);
        try {
            await command.run(message, args)
        } catch (e) {
            let data = {
                messageID: message.id,
                guildID: message.guild.id,
                command: command.help.name,
                error: e.stack
            };
            console.log(require('chalk').redBright(`[ ! ] Command Error [ ! ]\n\n${data.error}`));
            return message.responder.error(`**Command Error**\nFailed to execute command '${command.help.name}':\`\`\`${e.message}\`\`\`\nReport this error to the bot developer or bot support team.`, true);
        };
    };
};