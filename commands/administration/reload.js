const Discord = require("discord.js");
const config = require("../../config.json");
const client = new Discord.Client();
const { readdirSync } = require("fs");

module.exports.run = async (bot, message, args) => {
	
	resetBot(message.channel);
	
	function resetBot(channel) {
    channel.send('Resetting...')
    .then(msg => client.destroy())
    .then(() => client.login(config.token)
	)}
};

module.exports.help = {
  name: "reload",
  description: "Reloads the bot",
  usage: "",
  category: "administration",
  aliases: [""]
};
