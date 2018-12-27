const Command = require('../../Base/Command.js');
const { table } = require('table');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'tag',
            category: 'admin',
            description: 'Add, edit, list, or delete custom commands or \'tags\' for your server.',
            usage: '{prefix}tag <add|edit|list|delete> <tagName> [tagValue]',
            parameters: 'stringAction, stringTagName, stringTagValue',
            extended: false,
            devOnly: false,
            staffOnly: false,
            perms: ['MANAGE_GUILD', 'EMBED_LINKS', 'admin.tag'],
            aliases: []
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.cmdHelp(message, 'tag');
        if (!['add', 'list', 'edit', 'del', 'delete'].includes(args[0].toLowerCase())) {
            return message.responder.error('Invalid action. Valid actions: `add`, `list`, `edit`, `delete`', true);
        };
        switch (args[0].toLowerCase()) {
            case 'add': {
                if (!args[1]) return message.responder.error('Please provide a name for the tag.', true);
                const [ name, value ] = [ args[1], args.slice(2).join(' ') ];
                if (this.client.store.tags.has(`${message.guild.id}-${name}`)) return message.responder.error('A tag with that name already exists.', true);
                if (!value || value.length < 1) return message.responder.error('Please provide a value for the tag.', true);
                this.client.store.tags.set(`${message.guild.id}-${name}`, value);
                return message.responder.success(`Successfully added a new tag with the name \`${name}\``, true);
            };
            break;
            case 'edit': {
                if (!args[1]) return message.responder.error('Please provide a name for the tag you wish to edit.', true);
                const [ name, newValue ] = [ args[1], args.slice(2).join(' ') ];
                if (!this.client.store.tags.has(`${message.guild.id}-${name}`)) return message.responder.error('A tag with that name does not exist.', true);
                if (!newValue || newValue.length < 1) return message.responder.error('Please provide the new value for the tag.', true);
                this.client.store.tags.set(`${message.guild.id}-${name}`, newValue);
                return message.responder.success(`Successfully updated the tag \`${name}\``, true);
            };
            break;
            case 'list': {
                const index = this.client.store.tags.indexes.filter(i => i.split('-')[0] == message.guild.id);
                const list = [];
                let counter = 0;
                for ( let i = 0; i < index.length; i++ ) {
                    ++counter;
                    list.push(`[${counter}] ${index[i].split('-')[1]}`);
                };
                const splitOptions = {
                    maxLength: 2000,
                    char: '\n',
                    prepend: '```',
                    append: '```'
                };
                return message.channel.send(`Found \`${index.length}\` tag${index.length == 1 ? '' : 's'} for ${message.guild.name}:\`\`\`${list.join('\n')}\`\`\``, { split: splitOptions });
            };
            break;
            case 'del':
            case 'delete': {
                if (!args[1]) return message.responder.error('Please provide a name for the tag.', true);
                const name = args[1];
                if (!this.client.store.tags.has(`${message.guild.id}-${name}`)) return message.responder.error('A tag with that name does not exist.', true);
                this.client.store.tags.delete(`${message.guild.id}-${name}`);
                return message.responder.success(`Successfully deleted the tag \`${name}\``, true);
            };
        };
    };
};