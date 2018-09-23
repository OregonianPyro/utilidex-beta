const { RichEmbed } = require('discord.js');
const Command = require('../../base/command.js');

class Tag extends Command {
    constructor(client) {
        super(client, {
            name: 'tag',
            category: 'tags',
            description: 'Add, remove, rename, edit, or view custom commands (or tags) for your server.',
            usage: '{prefix}tag --<flag> [arguments]',
            parameters: 'stringFlag, stringArguments',
            extended: true,
            extended_help: 'Adding a Tag: `{prefix}tag --add <tag name> <tag content>`\nDeleting a Tag: `{prefix}tag --del|delete|remove <tag name>`\nRenaming a Tag: `{prefix}tag --rename <old name> <new name>`\nEditing a Tag: `{prefix}tag --edit <tag name> <new content>`\nViewing Your Tags: `{prefix}tag --view`',
            enabled: true,
            reason: null,
            devOnly: false,
            guildOnly: true,
            permission: 'MANAGE_GUILD',
            bot_permission: 'SEND_MESSAGES',
            aliases: ['customcommands', 'customcommand', 'cc', 'tags']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(this.client, message, 'tag');
        if (!message.content.includes('--')) return;
        const action = message.content.split('--')[1].split(' ')[0];
        if (action === 'add') {
            if (message.tags.length >= 100) return this.client.error(message, 'Maximum amount of tags (100) reached. Please remove a tag (or tags) to add a new one.');
            if (!args[1] || !args[2]) return this.client.error(message, 'Please provide a name and content for the tag.');
            const [ key, val ] = args.slice(1).join(' ').split(' ');
            if (this.key_exists(key, message)) return this.client.error(message, 'A tag with that name already exists.');
            message.tags.push({ key: key, val: val });
            this.client.tags.set(message.guild.id, message.tags);
            return message.channel.send(`${this.client.emotes.check} Successfully created the tag \`${key}\``);
        } else if (['del', 'delete', 'rem', 'remove'].includes(action)) {
            if (!args[1]) return this.client.error(message, 'Please provide a name for the tag to delete.');
            const key = args.slice(1).join(' ').split(' ')[0];
            if (!this.key_exists(key, message)) return this.client.error(message, 'A tag with that name does not exist.');
            message.tags.splice(this.index(key, message), 1);
            this.client.tags.set(message.guild.id, message.tags);
            return message.channel.send(`${this.client.emotes.check} Successfully removed the tag \`${key}\``);
        } else if (action === 'rename') {
            if (!args[1] || !args[2]) return this.client.error(message, 'Please provide the current name and the new name for the tag.');
            const [ old_name, new_name ] = args.slice(1).join(' ').split(' ');
            if (!this.key_exists(old_name, message)) return this.client.error(message, 'A tag with that name does not exist.');
            if (this.key_exists(new_name, message)) return this.client.error(message, 'A tag with the new name already exists.');
            if (this.is_command(new_name)) return this.client.error(message, 'The new name provided is a name of a command on the bot and cannot be added.');
            const old_content = this.get_old_content(old_name, message);
            console.log(old_content);
            message.tags.splice(this.index(old_name, message), 1);
            message.tags.push({ key: new_name, val: old_content });
            return message.channel.send(`${this.client.emotes.check} Successfully renamed the tag \`${old_name}\` to \`${new_name}\``);
        } else if (action === 'edit') {
            if (!args[1] || !args[2]) return this.client.error(message, 'Please provide the name of the tag and the new content for the tag.');
            const key = args.slice(1).join(' ').split(' ')[0];
            const new_val = args.slice(2).join(' ');
            if (!this.key_exists(key, message)) return this.client.error(message, 'A tag with that name does not exist.');
            message.tags.splice(this.index(key, message), 1);
            message.tags.push({ key: key, val: new_val });
            return message.channel.send(`${this.client.emotes.check} Successfully edited the value for  the tag \`${key}\``);
        } else if (['view', 'list'].includes(action)) {
            const values = [];
            const opts = {
                maxLength: 1950,
                char: '\n',
                prepend: '```',
                append: '```'
            };
            for (let i = 0; i < message.tags.length; i++) {
                values.push(`${message.tags[i].key} - ${message.tags[i].val}`);
            };
            return message.channel.send(`Found ${message.tags.length} ${message.tags.length > 1 ? 'tags' : 'tag'} for ${message.guild.name}\`\`\`${values.join('\n')}\`\`\``, { split: opts });
        } else if (action === 'flags' || args[0] === 'flags') {
            return message.channel.send('```--add (adds a new tag)\n--rem|remove|del|delete (Removes a current tag)\n--rename (Changes the name of a tag)\n--edit (Edits the value for a tag)\n--view|list (Returns a list of tags your server has)```');
        };
    };
    key_exists (key, message) {
        let boolean;
        message.tags.forEach(tag => {
            if (tag.key !== key) return;
            if (tag.key === key) return boolean = true;
        });
        return boolean;
    };

    index (key, message) {
        let i;
        for (let i = 0; i < message.tags.length; i++) {
            if (message.tags[i].key === key) return i = i;
        };
        return i;
    };

    is_command (key) {
        return (this.client.commands.has(key) || this.client.aliases.has(key));
    };

    get_old_content (key, message) {
        let content;
        for (let i = 0; i < message.tags.length; i++) {
            if (message.tags[i].key !== key) return;
            console.log(message.tags[i]);
            return content = message.tags[i].val;
        };
        return content;
    };
};

module.exports = Tag;       
