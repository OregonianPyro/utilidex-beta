const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

 class Settings extends Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            category: 'admin',
            description: 'View, edit, or reset the settings for your server.',
            usage: '{prefix}settings <view|edit|reset> <key> [value]',
            parameters: 'stringFlag, stringKey, *Value',
            extended: true,
            extended_help: 'To configure your welcome / leave settings, use this format:\n`{prefix}settings edit <welcome|leave> <key> <value>`\nAvailable Keys: `enabled`, `color`, `channel`, `message`, `type`, `footer`',
            enabled: true,
            reason: false,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_GUILD',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['set', 'conf']
        });
    };

    async run(message, args) {
        message.delete();
        let msg = await message.channel.send('Welcome to Utilidex\'s settings menu! To get started, provide an action. The list of actions are: `view`, `edit`, `reset`\n\n:stopwatch: This menu will timeout after one minute.');
        let filter = m => m.author.id === message.author.id;
        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).then(msgs => {
            let flag = msgs.first().content.split(' ')[0].toLowerCase();
            if (flag === 'view') {
                msgs.first().delete();
                msg.delete();
                return require('../../functions/settings/view/main.js')(msgs.first(), message);
            } else if (flag === 'edit') {
                msgs.first().delete();
                return require('../../functions/settings/edit/main.js')(msgs.first(), message);
            } else if (flag === 'reset') {

            };
        })    };
 };

 module.exports = Settings;
