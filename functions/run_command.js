const { RichEmbed } = require('discord.js');

module.exports = async (message, args) => {
    const tag_exists = (tag) => {
        let exists;
        for (let i = 0; i < message.tags.length; i++) {
            if (message.tags[i].key !== tag) exists = false
            else return exists = true
        };
        return exists;
    };
    const get_tag_content = (tag) => {
        let content;
        for (let i = 0; i === message.tags.length; i++) {
            if (message.tags[i].key !== tag) return;
            if (message.tags[i].key === tag) return content = message.tags[i].val;
        };
        return content;
    };
    const client = message.client;
    const command = message.content.split(' ')[0].slice(message.settings.prefix.length).toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd && !tag_exists(command)) return;
    if (cmd !== false && !tag_exists(command)) {
        try {
            await cmd.run(message, args);
        } catch (e) {
            const err = require('./error_code.js')();
            client.errors.set(err, {
                msg: e.message,
                stack: e.stack,
                guild: {
                    name: message.guild.name,
                    id: message.guild.id
                },
                message: {
                    content: message.content,
                    channel_name: message.channel.name,
                    channel_id: message.channel.id,
                    message_id: message.id
                }
            });
            if (message.author.id === '312358298667974656') return message.reply(`\`${e.message}\` | \`${err}\``);
            return message.channel.send({
                embed: {
                    color: 0xff0000,
                    description: `${client.emotes.x} **There was an error executing this command.**\n\nClick [here](https://github.com/OregonianPyro/utilidex-beta/issues) to report the bug on our GitHub, or join our support server [here](https://discord.gg/2EY9HR2) and report it.`,
                    fields: [{
                        name: 'Error Code',
                        value: `When reporting this error, be sure to include this error code: \`${err}\``
                    }]
                }
            });
            message.delete(), message.channel.send(embed);
            message.reply(e.message);
            console.error(client.chalk.bgBlack.redBright(e.stack));
        };    
    };
    if (!cmd && tag_exists(command)) {
        let content;
        message.tags.forEach(tag => {
            if (tag.key !== command) return;
            return content = tag.val;
        });
        return message.channel.send(content);
    };
};