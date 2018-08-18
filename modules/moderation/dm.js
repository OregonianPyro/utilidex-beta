const { RichEmbed } = require('discord.js');
/**
 * 
 * @param {object} message The message object 
 * @param {object} member The member object
 * @param {string} reason The reason for the kick
 */
module.exports.kick = async (message, member, reason) => {
    try {
        const embed = new RichEmbed()
            .setColor('ORANGE')
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`You have been kicked from __${message.guild.name}__ by ${message.author.tag}`)
            .addField('Reason', reason)
            .setFooter('[!] You can join back with a valid invite link.');
        await member.send(`You have been moderated on ${message.guild.name}`, embed);
    } catch (e) {
        console.log(e.message);
    };
};
/**
 * 
 * @param {object} message The message object 
 * @param {object} member The member object
 * @param {string} reason The reason for the kick
 */
module.exports.ban = async (message, member, reason) => {
    try {
        const embed = new RichEmbed()
            .setColor('RED')
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`You have been banned from __${message.guild.name}__ by ${message.author.tag}`)
            .addField('Reason', reason);
        await member.send(`You have been moderated on ${message.guild.name}`, embed);
    } catch (e) {
        console.log(e.message);
    };
};

/**
 * 
 * @param {object} message The message object 
 * @param {object} member The member object
 * @param {string} reason The reason for the kick
 * @param {integer} time The length of the ban
 */
module.exports.tempban = async (message, member, reason, time) => {
    try {
        const embed = new RichEmbed()
            .setColor('RED')
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`You have been banned from __${message.guild.name}__ by ${message.author.tag} for \`${time}\``)
            .addField('Reason', reason)
            .setFooter('[!] You can join back after your ban expires.');
        await member.send(`You have been moderated on ${message.guild.name}`, embed);
    } catch (e) {
        console.log(e.message);
    };
};

/**
 * 
 * @param {object} message The message object 
 * @param {object} member The member object
 * @param {string} reason The reason for the kick
 * @param {integer} time The length of the mute
 */
module.exports.mute = async (message, member, reason, time) => {
    try {
        const embed = new RichEmbed()
            .setColor('GREY')
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`You have been muted in __${message.guild.name}__ by ${message.author.tag} for \`${time}\``)
            .addField('Reason', reason);
        await member.send(`You have been moderated on ${message.guild.name}`, embed);
    } catch (e) {
        console.log(e.message);
    };
};

/**
 * 
 * @param {object} message The message object
 * @param {string} mod The moderator who unmuted the user 
 * @param {object} member The member object
 * @param {string} reason The reason for the kick
 */
module.exports.unmute = async (message, mod, member, reason) => {
    try {
        const embed = new RichEmbed()
            .setColor('GREY')
            .setAuthor(message.guild.name, message.guild.iconURL)
            .setDescription(`You have been unmuted in __${message.guild.name}__ by ${mod}`)
            .addField('Reason', reason);
        await member.send(`You have been moderated on ${message.guild.name}`, embed);
    } catch (e) {
        console.log(e.message);
    };
};