const { RichEmbed } = require('discord.js');
const admin = [];
const bot = [];
const fun = [];
const moderation = [];
const music = [];
const trivia = [];
const utility = []
const set = (client, message) => {
    client.commands.forEach(i => {
        if (i.conf.devOnly) return;
        if (i.help.category === 'admin') {
            if (admin.includes(i.help.name)) return;
            admin.push(`${message.settings.prefix}${i.help.name} - ${i.help.description}`);
        } else if (i.help.category === 'bot') {
            if (bot.includes(i.help.name)) return;
            bot.push(`${message.settings.prefix}${i.help.name} - ${i.help.description}`);
        } else if (i.help.category === 'fun') {
            if (fun.includes(i.help.name)) return;
            fun.push(`${message.settings.prefix}${i.help.name} - ${i.help.description}`);
        } else if (i.help.category === 'moderation') {
            if (moderation.includes(i.help.name)) return;
            moderation.push(`${message.settings.prefix}${i.help.name} - ${i.help.description}`);
        } else if (i.help.category === 'music') {
            if (music.includes(i.help.name)) return;
            music.push(`${message.settings.prefix}${i.help.name} - ${i.help.description}`);
        } else if (i.help.category === 'trivia') {
            if (trivia.includes(i.help.name)) return;
            trivia.push(`${message.settings.prefix}${i.help.name} - ${i.help.description}`);
        } else if (i.help.category === 'utility') {
            if (utility.includes(i.help.name)) return;
            utility.push(`${message.settings.prefix}${i.help.name} - ${i.help.description}`);
        };
    });
};

module.exports.admin = (client, message) => {
    set(client, message);
    return admin.length > 0 ? admin.join('\n') : 'soon:tm:';
};

module.exports.bot = (client, message) => {
    set(client, message);
    return bot.length > 0 ? bot.join('\n') : 'soon:tm:';
};

module.exports.fun = (client, message) => {
    set(client, message);
    return fun.length > 0 ? fun.join('\n') : 'soon:tm:';
};

module.exports.moderation = (client, message) => {
    set(client, message);
    return moderation.length > 0 ? moderation.join('\n') : 'soon:tm:';
};

module.exports.music = (client, message) => {
    set(client, message);
    return music.length > 0 ? music.join('\n') : 'soon:tm:';
};

module.exports.trivia = (client, message) => {
    set(client, message);
    return trivia.length > 0 ? trivia.join('\n') : 'soon:tm:';
};

module.exports.utility = (client, message) => {
    set(client, message);
    return utility.length > 0 ? utility.join('\n') : 'soon:tm:';
};