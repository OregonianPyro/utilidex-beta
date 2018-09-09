module.exports = async (m, message) => {
    let msg = await message.channel.send('To edit a current setting, please provide a valid key. Valid keys are:```prefix, modlog, message log, nick log, image log, role log, server log, mute role, staff role, welcome config, leave config```\n:stopwatch: This menu will time out after __30 seconds__');
    let filter = m => m.author.id === message.author.id;
    let obj = { max: 1, time: 30000, errors: ['time'] };
    message.channel.awaitMessages(filter, obj)
        .then(async (msgs) => {
            let option = ['prefix', 'modlog', 'nickname log', 'nicklog', 'message log', 'msglog', 'messagelog', 'image log', 'imagelog', 'role log', 'rolelog', 'server log', 'serverlog', 'mute role', 'muterole', 'staff', 'staff role', 'staffrole', 'welcome config', 'leave config'];
            if (!option.includes(msgs.first().content)) return msgs.first().delete(), msg.edit(`${message.client.emotes.x} Hmm, it seems you provided an invalid key. Try again with a valid key.`);
            option = option[option.indexOf(msgs.first().content)];
            msgs.first().delete();
            if (option === 'prefix') {
                msg.edit('```What should the new prefix be?\n\nType \'cancel\' to cancel the menu.```\n:stopwatch: This will time out after 30 seconds.');
                message.channel.awaitMessages(filter, obj).then(msgs2 => {
                    if (msgs2.first().content.split(' ')[0].toLowerCase() === 'cancel') return msgs2.first().delete(), msg.edit(`${message.client.emotes.check} Successfully cancelled the menu.`);
                    if (msgs2.first().content.split(' ')[0].length >= 10) {
                        msgs2.first().delete();
                        return msg.edit(`${message.client.emotes.x} Hey now, \`${msgs2.first().content.split(' ')[0]}\` seems like a long prefix! Try a shorter one.`);
                    };
                    message.settings.prefix = msgs2.first().content.split(' ')[0];
                    message.client.settings.set(message.guild.id, message.settings);
                    msgs2.first().delete();
                    return msg.edit(`${message.client.emotes.check} Your prefix is now \`${message.settings.prefix}\``);
                });
            } else if (option === 'modlog') {
                msg.edit('```What should the new modlog be?\n\nType \'cancel\' to cancel the menu.```\n:stopwatch: This will time out after 30 seconds.');
                message.channel.awaitMessages(filter, obj).then(msgs2 => {
                    if (msgs2.first().content.split(' ')[0].toLowerCase() === 'cancel') return msgs2.first().delete(), msg.edit(`${message.client.emotes.check} Successfully cancelled the menu.`);
                    let channel = msgs2.first().mentions.channels.first() || message.guild.channels.find(c => c.name.includes(msgs2.first().content.split(' ')[0].toLowerCase())) || message.guild.channels.get(msgs2.first().content.split(' ')[0]);
                    if (!channel) {
                        msgs2.first().delete();
                        return msg.edit(`${message.client.emotes.x} It seems you didn't provide a valid channel.`);
                    };
                    channel = message.guild.channels.get(channel.id);
                    message.settings.logging.modlog.channel = channel.id;
                    message.client.settings.set(message.guild.id, message.settings);
                    msgs2.first().delete();
                    return msg.edit(`${message.client.emotes.check} All moderation actions will now be sent to ${channel.toString()}`);
                });
            } else if (['nickname log', 'nicklog'].includes(option)) {

            } else if (['message log', 'msglog'].includes(option)) {

            } else if (['image log', 'imagelog'].includes(option)) {

            } else if (['role log', 'rolelog'].includes(option)) {

            } else if (['server log', 'serverlog'].includes(option)) {

            } else if (['mute role', 'muterole'].includes(option)) {

            } else if(['staff', 'staff role', 'staffrole'].includes(option)) {

            } else if (option === 'welcome config') {

            } else if (option === 'leave config') {

            };
        });
};