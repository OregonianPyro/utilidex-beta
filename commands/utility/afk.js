const { RichEmbed } = require('discord.js');
const Command = require('../../base/command.js');

class AFK extends Command {
    constructor(client) {
        super(client, {
            name: 'afk',
            category: 'utility',
            description: 'set or remove your AFK message.',
            usage: '{prefix}afk [message]',
            parameters: 'stringFlag, stringMessage',
            extended: false,
            enabled: true,
            reason: null,
            guildOnly: true,
            devOnly: false,
            permission: 'SEND_MESSAGES',
            bot_permission: 'EMBED_LINKS',
            aliases: ['dnd', 'away']
        });
    };

    async run(message, args) {
        const { has_AFK, index } = this;
        const isAFK = await has_AFK(message);
        if (!isAFK) {
          if (!args[0]) {
              this.client.AFK.push(message.guild.id, {
                  tag: message.author.tag,
                  id: message.author.id,
                  message: 'no message set',
                  timestamp: message.createdAt
              });
              return message.channel.send(`${this.client.emotes.check} You are now AFK with the following message: \`no message set\``);
          } else {
              this.client.AFK.push(message.guild.id, {
                  tag: message.author.tag,
                  id: message.author.id,
                  message: args.join(' '),
                  timestamp: message.createdAt
              });
              return message.channel.send(`${this.client.emotes.check} You are now AFK with the following message: \`${args.join(' ')}\``);
          };
        } else if (!args[0] && isAFK) {
            this.client.AFK.get(message.guild.id).splice(index(message), 1);
            this.client.AFK.set(message.guild.id, this.client.AFK.get(message.guild.id));
            return message.channel.send(`${this.client.emotes.check} Successfully removed your AFK.`);
        };
    };

    async has_AFK(message) {
        const client = message.client;
        let res;
        if (client.AFK.get(message.guild.id).length < 1) return false;
        for (let i = 0; i < client.AFK.get(message.guild.id).length; i++) {
            if (client.AFK.get(message.guild.id)[i].id !== message.author.id) res = false;
            if (client.AFK.get(message.guild.id)[i].id === message.author.id) res = true;
        };
        return res;
    };

    index(message) {
        const client = message.client;
        let i;
        for (let i = 0; i < client.AFK.get(message.guild.id).length; i++) {
            if (client.AFK.get(message.guild.id)[i].id === message.author.id) return i = i;
        };
        return i;
    };
};


module.exports = AFK;
