module.exports = (message) => {
    //if (!message.settings.automod.invite_links.enabled) return;
    if (message.settings.automod.invite_links.ignored.users.includes(message.author.id)) return;
    if (message.settings.automod.invite_links.ignored.channels.includes(message.channel.id)) return;
    if (message.member.roles.some(r => message.settings.automod.invite_links.ignored.roles.includes(r.id))) return;
    return message.delete(), message.channel.send(`${message.author} | ${message.client.emotes.warn} This server does not allow invite links - your message has been deleted.`);
};