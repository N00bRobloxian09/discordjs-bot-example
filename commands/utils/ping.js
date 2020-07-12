const Discord = require("discord.js");
const { readdirSync } = require("fs");

module.exports.run = async (bot, message, args) => {
    var embed = new Discord.RichEmbed()
    .setAuthor(`Ping is ${bot.ping}ms`)
    .setColor("RANDOM")
message.channel.send(embed)
    .catch(console.error);
}
module.exports.help = {
  name: "ping",
  description: "pong",
  usage: "ping",
  category: "Utils",
  aliases: ["pong"]
};
