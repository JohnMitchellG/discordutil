# discordutil

## About
discordutil is a user-friendly, powerful [Node.js](https://nodejs.org) module.

## Installation
**Node.js 6.0.0 or newer is required.**  

**Stable**: `npm i discordutil`

**Master**: `npm i chroventer/discordutil`

## Example
```js
// Main file – index.js
const { CommandHandler } = require('discordutil');
const handler = new CommandHandler({
    commandDir: `${__dirname}/commands/`,
    prefix: '!'
});

// Message event
client.on('message', (message) => {
    const args = message.content.split(' ');
    const command = args[0];
    const cmd = handler.getCommand(command);
    if (!cmd) return;

    try {
        cmd.run(client, message, args);
    } catch (err) {
        return console.error(err);
    }
});

// commands/ping.js
module.exports = class Ping {
    constructor() {
        this.name = 'ping',
            this.aliases = ['pong'],
            this.usage = '!ping'
    }

    async run(client, message, args) {
        return message.channel.send('Pong!');
    }
}
```

## Links
* [NPM](https://npmjs.com/package/discordutil)
* [Discord](https://discord.gg/3yXx8CN)
* [GitHub](https://github.com/chroventer/discordutil)