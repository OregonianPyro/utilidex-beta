const { RichEmbed } = require('discord.js');

class Update {
    constructor(client) {
        this.client = client;
    };

    async run(oldMessage, newMessage) {
        console.log('fired');
        const settings = this.client.settings.get(newMessage.guild.id).logging.msglog
        if (!settings.enabled) return;
        const msglog = newMessage.guild.channels.find(c => c.name === settings.channel) || newMessage.guild.channels.get(settings.channel);
        if (!msglog) return;
        if (!newMessage.content || oldMessage.content === newMessage.content) return;
        const old_content = oldMessage.content.length > 0 ? (oldMessage.content.length < 1024 ? oldMessage.content : 'Message Content Cannot be Displayed (length too long)') : 'Missing Content of Old Message (you shouldn\'t see this - report this to the developer)'; 
        const new_content = newMessage.content.length > 0 ? (newMessage.content.length < 1024 ? newMessage.content : 'Message Content Cannot be Displayed (length too long)') : 'Missing Content of New Message (you shouldn\'t see this - report this to the developer)'; 
        const embed = new RichEmbed()
            .setAuthor(newMessage.author.username, newMessage.author.displayAvatarURL)
            .setDescription(`${newMessage.author.tag} edited their message in ${newMessage.channel.toString()}`)
            .addField('Old Message', `\`\`\`${old_content}\`\`\``)
            .addField('New Message', `\`\`\`${new_content}\`\`\``)
            .setTimestamp()
            .setColor('GOLD');
        return msglog.send(embed);
    };
};

module.exports = Update;