const { RichEmbed } = require('discord.js');
const Command = require('../../base/command.js');

class Multiban extends Command {
    constructor(client) {
        super(client, {
            name: 'multiban',
            category: 'moderation',
            description: 'Bans multiple users at once.',
            usage: '{prefix}multiban <user IDs | user mentions>, <reason>',
            parameters: 'stringUserIDs|snowflakeUserMentions, stringReason',
            extended: false,
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'BAN_MEMBERS',
            bot_permission: 'BAN_MEMBERS',
            aliases: ['massban']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'multiban');
        let [ users, reason ] = args.join(' ').split(',');
        if (!users || users.length <= 18) return this.client.error(message, 'Please provide two or more user IDs and/or mentions!');
        if (!reason) reason = 'No Reason Provided';
        const msg = await message.channel.send('Verifying members...');
        users = users.split(' ');
        const sandbox = [];
        for (let i = 0; i < users.length; i++) {
        if (users[i].match(/<@!?(1|\d{17,19})>/)) sandbox.push(users[i].match(/<@!?(1|\d{17,19})>/)[1]);
           if (users[i].length === 18 && !isNaN(users[i])) sandbox.push(users[i]);
        };
        const to_ban = [];
        const tags = [];
        sandbox.forEach(i => {
           this.filter(message, i, to_ban, tags);
         });
        await msg.edit(`Attempting to ban \`${to_ban.length}\` users...`);
        for (let i = 0; i < to_ban.length; i++) {
            message.guild.ban(to_ban[i], reason);
        };
        return msg.edit(`${this.client.emotes.check} Successfully banned \`${to_ban.length}/${users.length}\` users:\`\`\`${tags.join('\n')}\`\`\`With the following reason: \`${reason}\``);    
    };

    filter(message, i, to_ban, tags) {
        if (i === message.author.id) return;
        if (i === message.client.user.id) return;
        //console.log(to_ban, to_ban.includes(i));
        if (to_ban.includes(i)) return;
        message.client.fetchUser(i).then(u => {
            to_ban.push(u.id);
            return tags.push(u.tag);
        }).catch(() => { });
    };
};

module.exports = Multiban;
