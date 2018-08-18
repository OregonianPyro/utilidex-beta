const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            category: 'developer',
            description: 'Evaluates JavaScript code.',
            usage: '{prefix}eval <code>',
            parameters: '*code',
            extended: false,
            enabled: true,
            reason: null,
            guildOnly: true,
            permission: 'SEND_MESSAGES',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['e']
        });
    };

    async run(message, args) {
        const notDev = new RichEmbed()
            .setColor('RED')
            .setTitle(`${this.client.emotes.x} This command can only be ran by the bot developer.`);
        if (message.author.id !== '312358298667974656') return message.delete(), message.channel.send(notDev)
        if (!args[0]) return;
        let flag;
        if (message.content.includes('--')) {
            flag = message.content.split('--')[1];
        } else {
            flag = null
        };
        if (flag === null) {
            const content = message.content.split(' ').slice(1).join(' ');
            const result = new Promise((resolve, reject) => resolve(eval(content)));
            return result.then(async output => {
                if (typeof output !== 'string') output = require('util').inspect(output, {
                    depth: 0
                });
                if (output.includes(process.env.TOKEN)) output = output.replace(process.env.TOKEN, '[TOKEN]');
                let toolong = new RichEmbed()
                    .setColor("GOLD")
                    .setTitle("Eval Success")
                    .setDescription(`:warning: **Length too long, check console.**`)
                if (output.length > 1024) return console.log(output), message.channel.send(toolong);
                let success = new RichEmbed()
                    .setColor("GREEN")
                    .addField(`${this.client.emotes.check} **Eval Success**`, `\`\`\`${output}\`\`\``)
                return message.channel.send(success)
            }).catch(err => {
                console.error(err);
                err = err.toString();

                if (err.includes(process.env.TOKEN)) err = err.replace(process.env.TOKEN, '[TOKEN]');
                let error = new RichEmbed()
                    .setColor("RED")
                    .addField(`${this.client.emotes.x} **Eval Fail**`, `\`\`\`${err}\`\`\``)
                return message.channel.send(error);
            });
        };
        if (flag.toLowerCase() === 'silent') {
            let content = message.content.split(' ').slice(1).join(' ').split('--')[0];
            const result = new Promise((resolve, reject) => resolve(eval(content)));
            return result.then(async output => {
                if (typeof output !== 'string') output = require('util').inspect(output, {
                    depth: 0
                });
                if (output.includes(process.env.TOKEN)) output = output.replace(process.env.TOKEN, '[TOKEN]');
                let toolong = new RichEmbed()
                    .setColor("GOLD")
                    .setTitle("Eval Success")
                    .setDescription(`:warning:**Length too long, check console.**`)
                if (output.length > 1024) return console.log(output), message.channel.send(toolong);
                let success = new RichEmbed()
                    .setColor("GREEN")
                    .addField(`${this.client.emotes.check} **Eval Success**`, `\`\`\`${output}\`\`\``)
                await message.channel.send(success);
                return message.channel.bulkDelete(1);
            }).catch(err => {
                console.error(err);
                err = err.toString();

                if (err.includes(process.env.TOKEN)) err = err.replace(process.env.TOKEN, '[TOKEN]');
                let error = new RichEmbed()
                    .setColor("RED")
                    .addField(`${this.client.emotes.x} **Eval Fail**`, `\`\`\`${err}\`\`\``)
                return message.channel.send(error);
            });
            //silent
        };
    };
};

module.exports = Eval;