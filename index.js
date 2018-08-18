const { Client, RichEmbed } = require('discord.js');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const { promisify } = require('util');
const readdir = promisify(require("fs").readdir);
const klaw = require('klaw');
const path = require('path');
require('dotenv').config();

class Utilidex extends Client {
    constructor(options) {
        super(options);
        this.chalk = require('chalk');
        this.moment = require('moment');
        this.default_settings = require('./modules/default/settings.js');
        this.emotes = {
            check: '<:utilidexPass:454452324413210624>',
            x: '<:utilidexFail:454452324455284738>',
            warn: '<:utilidexWarning:454452324807475222>'
        };
        this.perms = require('./functions/perms.js');
        this.args = require('./functions/args.js');
        this.commands = new Map();
        this.aliases = new Map();
        this.settings = new Enmap({ provider: new EnmapLevel({ name: 'settings'}) });
        this.mod_history = new Enmap({ provider: new EnmapLevel({ name: 'moderation history' }) });
        this.cases = new Enmap({ provider: new EnmapLevel({ name: 'cases' }) });
        this.mutes = new Enmap({ provider: new EnmapLevel({ name: 'mutes' }) });
        this.spam = new Enmap({ provider: new EnmapLevel({ name: 'spam' }) });
        this.custom_commands = new Enmap({ provider: new EnmapLevel({ name: 'custom commands' }) });
        this.color = '36393E';
        /**
         * @param {object} client The client object.
         * @param {object} message The message object.
         * @param {string} command The command to obtain information for.
         */
        this.help = (client, message, command) => {
            let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
            if (!cmd) throw new Error(`Command '${cmd}' not found.`);
            const embed = new RichEmbed()
                .setColor(client.color)
                .setAuthor(`${client.user.username} | Command: ${cmd.help.name.split('')[0].toUpperCase()}${cmd.help.name.split('').slice(1).join('')}`, client.user.displayAvatarURL)
                .setDescription('`< >` denotes a __required__ parameter.\n`[ ]` denotes an optional parameter.')
                .addField('Description', cmd.help.description)
                .addField('Usage', cmd.help.usage.replace('{prefix}', message.settings.prefix))
                .addField('Parameters', `\`\`\`${cmd.help.parameters}\`\`\``)
                .addField('Aliases', `\`[${cmd.conf.aliases.join(', ')}]\``);
            if (!cmd.help.extended) return message.delete(), message.channel.send(embed);
            embed.addField('Extended Help', cmd.help.extended_help);
            return message.delete(), message.channel.send(embed);
        };
    };
    loadCommand(commandPath, commandName) {
        try {
            if (commandName === 'command.js') return;
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
            console.log(this.chalk.bgBlack.green(`Loaded Command: ${props.help.name} | Aliases: [${props.conf.aliases.join(', ')}]`));
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            if (commandName === 'command.js') return;
            return this.chalk.bgBlack.redBright(`Unable to load command ${commandName}: ${e.message}`);
        };
    };
    async unloadCommand(commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
            command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
            command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` is not recognized by the bot.`;

        if (command.shutdown) {
            await command.shutdown(this);
        }
        delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
        return false;
    };
};

const client = new Utilidex();
const init = async () => {
    klaw("./commands").on("data", (item) => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
        if (response) console.error(response);
    });
    const evtFiles = await readdir("./events/");
    console.log(`Loading a total of ${evtFiles.length} events`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        console.log(client.chalk.bgBlack.green(`Loaded the event ${eventName}`));
        const event = new (require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
};

init();
client.login(process.env.TOKEN);

process.on('unhandledRejection', error => {
    console.error(`Uncaught Promise Error: \n${error.stack}`);
});