const { RichEmbed, Attachment } = require('discord.js');

class guildMemberAdd {
    constructor(client) {
        this.client = client;
        this.API = this.client.API;
    };

    async run(member) {
        const settings = this.client.settings.get(member.guild.id);
        const stickyRoles = this.client.stickyRoles.get(member.guild.id);
        let memberHasStickyRoles = false;
        const hasStickyRoles = () => {
            const res = [];
            stickyRoles.forEach(i => {
                if (i.includes(member.user.id)) {
                    res.push(i.split('-')[1]);
                };
            });
            return res;
        };
        if (hasStickyRoles().length > 0) memberHasStickyRoles = hasStickyRoles();
        if (!memberHasStickyRoles && !settings.logging.memberlog.enabled && !settings.welcome_config.enabled) return;
        if (memberHasStickyRoles.length > 0) {
            memberHasStickyRoles.forEach(async r => {
                try {
                    await member.addRole(r, 'Adding Sticky-Roles');
                } catch (e) {
                    return console.error;
                };
            });
        };
        if (!settings.logging.memberlog.enabled && settings.welcome_config.enabled) {
            const channel = member.guild.channels.get(settings.welcome_config.channel);
            if (!channel) return;
            let msg = settings.welcome_config.message;
            if (!msg) msg = '**{tag}** just joined!';
            msg = msg.replaceAll('{mention}', member.toString());
            msg = msg.replaceAll('{username}', member.user.username);
            msg = msg.replaceAll('{tag}', member.user.tag);
            msg = msg.replaceAll('{guild}', member.guild.name);
            msg = msg.replaceAll('{size}', member.guild.members.size);
            msg = msg.replaceAll('{created}', this.client.moment(member.user.createdAt).format('LLLL'));
            msg = msg.replaceAll('{age}', this.client.moment(member.user.createdAt).fromNow());
            if (settings.welcome_config.type === 'text') {
                return channel.send(msg);
            } else if (settings.welcome_config.type === 'embed') {
                const color = settings.welcome_config.color ? settings.welcome_config.color : this.client.color;
                let footer_msg = settings.welcome_config.footer;
                footer_msg = footer_msg.replaceAll('{mention}', member.toString());
                footer_msg = footer_msg.replaceAll('{username}', member.user.username);
                footer_msg = footer_msg.replaceAll('{tag}', member.user.tag);
                footer_msg = footer_msg.replaceAll('{guild}', member.guild.name);
                footer_msg = footer_msg.replaceAll('{size}', member.guild.members.size);
                footer_msg = footer_msg.replaceAll('{created}', this.client.moment(member.user.createdAt).format('LLLL'));
                footer_msg = footer_msg.replaceAll('{age}', this.client.moment(member.user.createdAt).fromNow());
                const footer = settings.welcome_config.footer ? footer_msg : '';
                const embed = new RichEmbed()
                    .setAuthor(member.user.username, member.user.displayAvatarURL)
                    .setTitle('New Member')
                    .setDescription(msg)
                    .setThumbnail(member.user.displayAvatarURL)
                    .setColor(color)
                    .setFooter(footer)
                    .setTimestamp();
                return channel.send(member.toString(), embed);
            } else if (settings.welcome_config.type === 'canvas') {
                const image = await this.API.welcome('gearz', member.user.bot, member.user.displayAvatarURL, member.user.tag, `${member.guild.name}#${member.guild.members.size}`);
                return channel.send(msg, await new Attachment(image, `welcome_${member.user.id}.png`));
            };
        } else if (settings.logging.memberlog.enabled && !settings.welcome_config.enabled) {
            let has_roles;
            if (!memberHasStickyRoles) has_roles = false
            else has_roles = memberHasStickyRoles.length;
            has_roles = !has_roles ? '' : `\n**User was given \`${has_roles}\` sticky roles.**`;
            const embed = new RichEmbed()
                .setColor('GREEN')
                .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL)
                .setTitle('New Member Joined')
                .setDescription(`**Account Made On:** \`${this.client.moment(member.user.createdAt).format('LLLL')}\`\n**Account Age:** \`${this.client.moment(member.user.createdAt).fromNow()}\`${has_roles}`)
                .setFooter('Joined')
                .setTimestamp();
            const logChannel = member.guild.channels.get(settings.logging.memberlog.channel);
            if (!logChannel) return;
            return logChannel.send(embed);
        } else if (settings.logging.memberlog.enabled && settings.welcome_config.enabled) {
            const welcomeChannel = member.guild.channels.get(settings.welcome_config.channel);
            if (!welcomeChannel) return;
            let msg = settings.welcome_config.message;
            if (!msg) msg = '**{tag}** just joined!';
            msg = msg.replaceAll('{mention}', member.toString());
            msg = msg.replaceAll('{username}', member.user.username);
            msg = msg.replaceAll('{tag}', member.user.tag);
            msg = msg.replaceAll('{guild}', member.guild.name);
            msg = msg.replaceAll('{size}', member.guild.members.size);
            msg = msg.replaceAll('{created}', this.client.moment(member.user.createdAt).format('LLLL'));
            msg = msg.replaceAll('{age}', this.client.moment(member.user.createdAt).fromNow());
            if (settings.welcome_config.type === 'text') {
                welcomeChannel.send(msg);
            } else if (settings.welcome_config.type === 'embed') {
                const color = settings.welcome_config.color ? settings.welcome_config.color : this.client.color;
                let footer_msg = settings.welcome_config.footer;
                footer_msg = footer_msg.replaceAll('{mention}', member.toString());
                footer_msg = footer_msg.replaceAll('{username}', member.user.username);
                footer_msg = footer_msg.replaceAll('{tag}', member.user.tag);
                footer_msg = footer_msg.replaceAll('{guild}', member.guild.name);
                footer_msg = footer_msg.replaceAll('{size}', member.guild.members.size);
                footer_msg = footer_msg.replaceAll('{created}', this.client.moment(member.user.createdAt).format('LLLL'));
                footer_msg = footer_msg.replaceAll('{age}', this.client.moment(member.user.createdAt).fromNow());
                const footer = settings.welcome_config.footer ? footer_msg : '';
                const embed = new RichEmbed()
                    .setAuthor(member.user.username, member.user.displayAvatarURL)
                    .setTitle('New Member')
                    .setDescription(msg)
                    .setThumbnail(member.user.displayAvatarURL)
                    .setColor(color)
                    .setFooter(footer)
                    .setTimestamp();
                welcomeChannel.send(member.toString(), embed);
            } else if (settings.welcome_config.type === 'canvas') {
                const image = await this.API.welcome('gearz', member.user.bot, member.user.displayAvatarURL, member.user.tag, `${member.guild.name}#${member.guild.members.size}`);
                await welcomeChannel.send(msg, await new Attachment(image, `welcome_${member.user.id}.png`));
            };
            let has_roles;
            if (!memberHasStickyRoles) has_roles = false
            else has_roles = memberHasStickyRoles.length;
            has_roles = !has_roles ? '' : `\n**User was given \`${has_roles}\` sticky roles.**`;
            const embed = new RichEmbed()
                .setColor('GREEN')
                .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL)
                .setTitle('New Member Joined')
                .setDescription(`**Account Made On:** \`${this.client.moment(member.user.createdAt).format('LLLL')}\`\n**Account Age:** \`${this.client.moment(member.user.createdAt).fromNow()}\`${has_roles}`)
                .setFooter('Joined')
                .setTimestamp();
            const logChannel = member.guild.channels.get(settings.logging.memberlog.channel);
            if (!logChannel) return;
            return logChannel.send(embed);
        };
    };
};

module.exports = guildMemberAdd;
