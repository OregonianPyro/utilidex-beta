const { Client, MessageEmbed, Collection } = require('discord.js');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const { promisify } = require('util');
const readdir = promisify(require("fs").readdir);
const klaw = require('klaw');
const path = require('path');
const { table } = require('table');
const chalk = require('chalk');
// const Idiot = require('idiotic-api');
require('dotenv').config();
// require('./functions/prototype.js');

class Utilidex extends Client {
    constructor(options) {
        super(options);
        //this.API = new Idiot.Client(process.env.API, { dev: true });
        this.defaultGuildData = require('./Scripts/guildData.js');
        this.triggers = new Enmap({ provider: new EnmapLevel({ name: 'triggers' }) });
        this.store = require('./Scripts/Store.js');
        this.commands = new Collection();
        this.aliases = new Collection()
        this.cmdHelp = (message, command) => {
            const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
            if (!cmd) throw new Error(`Command '${cmd}' not found.`);
            const embed = new MessageEmbed()
                .setColor('BLUE')
                .setAuthor(`${client.user.username} | Command: ${cmd.help.name.split('')[0].toUpperCase()}${cmd.help.name.split('').slice(1).join('')}`, client.user.displayAvatarURL)
                .setDescription('`< >` denotes a __required__ parameter.\n`[ ]` denotes an optional parameter.')
                .addField('Description', cmd.help.description)
                .addField('Usage', cmd.help.usage.replace('{prefix}', message.settings.prefix))
                .addField('Parameters', `\`\`\`${cmd.help.parameters}\`\`\``)
                .addField('Aliases', `\`[${cmd.conf.aliases.join(', ')}]\``);
            if (!cmd.help.extended) return message.channel.send(embed);
            embed.addField('Extended Help', cmd.help.extended_help);
            return message.channel.send(embed);
        };
    };
    loadCommand(commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            };
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            console.log(chalk.redBright(`[ X ] Failed to Load Command '${commandName}':\n\n ${e.stack}`));
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
client.ready = false;
const init = async () => {
    klaw("./Src/Commands").on("data", (item) => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
        if (response) console.error(response);
    });
    const CoreEvents = await readdir('./Src/Events/Core Events/');
    const guildEvents = await readdir('./Src/Events/Guild Events/');
    const serverLogEvents = await readdir('./Src/Events/Server-Log Events/');
    console.log(`Loading a total of [${CoreEvents.length}] Core Events`);
    console.log(`Loading a total of [${guildEvents}] guild Events`);
    console.log(`Loading a total of [${serverLogEvents.length}] Server-Log Events`);
    CoreEvents.forEach(file => {
        const eventName = file.split('.')[0];
        console.log(chalk.bgBlack.green(`[ » ] Loaded the core event ${eventName}`));
        const event = new (require(`./Events/Core Events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./Events/Core Events/${file}`)];
    });
    guildEvents.forEach(file => {
        const eventName = file.split('.')[0];
        console.log(chalk.bgBlack.green(`[ » ] Loaded the guild event ${eventName}`));
        const event = new (require(`./Events/Guild Events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./Events/Guild Events/${file}`)];
    });
    serverLogEvents.forEach(file => {
        const eventName = file.split('.')[0];
        console.log(chalk.bgBlack.green(`[ » ] Loaded the server-log event ${eventName}`));
        const event = new (require(`./Events/Server-Log Events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./Events/Server-Log Events/${file}`)];
    });
};

init();
client.login(process.env.TOKEN);

process.on('unhandledRejection', error => {
    console.error(`Uncaught Promise Error: \n${error.stack}`);
});