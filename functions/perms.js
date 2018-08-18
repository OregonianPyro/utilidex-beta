const { RichEmbed } = require('discord.js');
/**
 * 
 * @param {object} message The message object.
 * @param {string} perm The missing permission. 
 */
module.exports.member = (message, perm) => {
    const embed = new RichEmbed()
        .setColor('RED')
        .setTitle('Permissions Error')
        .setDescription(`${message.client.emotes.x} You require the permission \`${perm}\` to use this command.`);
    return message.channel.send(embed);
};
/**
 * 
 * @param {object} message The message object.
 * @param {string} perm The missing permission. 
 */
module.exports.bot = (message, perm) => {
    const embed = new RichEmbed()
        .setColor('RED')
        .setTitle('Permissions Error')
        .setDescription(`${message.client.emotes.x} The bot requires the permission \`${perm}\` to execute this command.`);
    return message.channel.send(embed);
};