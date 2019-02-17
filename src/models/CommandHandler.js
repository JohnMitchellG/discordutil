const fs = require('fs');

class CommandHandler {
    constructor(options = {}) {

        if (!options.commandDir) throw new Error('Supply a command directory');
        if (!options.prefix) throw new Error('Supply a command prefix');
        if (!Array.isArray(options.prefix)) options.prefix = [ options.prefix ];
        options.prefix.sort((a, b) => a.length < b.length);

        /**
         * The commands directory of the command handler
         * @type {string}
         */
        this.commandDir = options.commandDir || `${__dirname}/commands/`;

        /**
         * The prefix of the commands for the command handler
         * @type {string}
         */
        this.prefix = options.prefix;

        this.commands = new Map();
        this.aliases = new Map();

        this.load(this.commandDir);
    }

    load(commandDir) {
        const files = fs.readdirSync(commandDir);
        files.filter((file) => {
            fs.statSync(commandDir + file).isDirectory();
        }).forEach((subdir) => {
            fs.readdirSync(commandDir + subdir).forEach((file) => files.push(`${subdir}/${file}`));
        });
        if (files.length <= 0) throw new Error('No commands found');
        const jsFiles = files.filter((file) => file.endsWith('.js'));
        for (const element of jsFiles) {
            const file = require(commandDir + element);
            const command = new file();
            const commandName = command.name;
            this.commands.set(commandName, command);
            for (const alias of command.aliases) {
                this.aliases.set(alias, commandName);
            }
        }
    }

    getCommand(name = '') {
        if (typeof name === 'undefined' || typeof name === null) {
            throw new Error('Supply a command name.');
        }
        let prefix = '';
        let prefixExists = false;

        for (const p of this.prefix) {
            if (name.startsWith(p)) {
                prefix = p;
                prefixExists = true;
                break;
            }
        }
        if (!prefixExists) return;
        const command = name.substring(prefix.length);
        let cmd = this.commands.get(command);
        if (!cmd) {
            const alias = this.aliases.get(command);
            if (!alias) return;
            cmd = this.commands.get(command);
        }
        return cmd;
    }
}

module.exports = CommandHandler;