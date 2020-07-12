const express = require('express');
const app = express();
const http = require('http');

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


const config = require("./config.json")
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { sep } = require("path");
const { success, error, warning } = require("log-symbols"); // npm i log-symbols / yarn add log-symbols


const bot = new Client();

bot.config = config;

["commands", "aliases"].forEach(x => bot[x] = new Collection());

const load = (dir = "./commands/") => {

	readdirSync(dir).forEach(dirs => {
		const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));

		for (const file of commands) {
			const pull = require(`${dir}/${dirs}/${file}`);
			if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
				if (bot.commands.get(pull.help.name)) return console.warn(`${warning} Two or more commands have the same name ${pull.help.name}!!`);
				bot.commands.set(pull.help.name, pull);
				console.log(`${success} Loaded command ${pull.help.name}.`);

			}
			else {
				console.log(`${error} Error loading command in ${dir}${dirs}. You have a missing: help.name or help.name is not a string! Or you have a missing help.category or help.category is not a string!`);
				continue;
			}
			if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
				pull.help.aliases.forEach(alias => {
					if (bot.aliases.get(alias)) return console.warn(`${warning} Two commands or more have the same aliases ${alias}!!!`);
					bot.aliases.set(alias, pull.help.name);
				});
			}
		}

	});
};

load();

bot.on("message", async message => {

	const prefix = bot.config.prefix;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	let command;

	if (message.author.bot || !message.guild) return;

	if (!message.member) message.member = await message.guild.fetchMember(message.author);

	if (!message.content.startsWith(prefix)) return;

	if (cmd.length === 0) return;
	if (bot.commands.has(cmd)) command = bot.commands.get(cmd);
	else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd));

	if (command) command.run(bot, message, args);
});

bot.on("ready", async () => {
console.log(`${bot.user.username} is ready for action!`);
if (config.activity.streaming == true) {
bot.user.setActivity(bot.activity.game, {url: 'https://twitch.tv/username'});
} else {
bot.user.setActivity(config.activity.game, {type: 'WATCHING'}); //PLAYING, LISTENING, WATCHING
bot.user.setStatus('online'); // dnd, idle, online, invisible
}
})

bot.login(config.token);