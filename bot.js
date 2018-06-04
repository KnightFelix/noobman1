const Discord = require("discord.js");

const YTDL = require("ytdl-core");

const PREFIX = "<";

function play(Connection, message) {
	var server = servers[message.guild.id];

	server.dispatcher = Connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
	
	server.queue.shift();

	server.dispatcher.on("end", function() {
		if (server.queue[0]) play(Connection, message);
		else Connection.disconnect();
	})
};

var fortunes = ["yes", "no", "maybe", "owo",];
	
var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
	console.log("ready");
});

bot.on("GuildMemberAdd", function(message) {
	member.guild.channels.find("name", "general").send(member.toString() + " welcome");

	member.addRole(member.guild.roles.find("name", "Rank 1"));

});

bot.on("message", function(message) {
	if (message.author.equals(bot.user)) return;
	
	if (!message.content.startsWith(PREFIX)) return;

	var args = message.content.substring(PREFIX.length).split(" ");

	switch (args[0].toLowerCase()) {
		case "ping":
			message.channel.send("pong!");
			break;

	case "8ball":
			if (args[1]) message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
			else message.channel.send("can't read that");
			break;
		
	case "embed":
		var embed = new Discord.RichEmbed()
			.addField("test title", "test description", true)
			.addField("test title", "test description", true)
			.addField("test title", "test description")
			.setColor(0xff0000)
			.setThumbnail(message.author.avatarURL)
		message.channel.sendEmbed(embed);
		break;

	case "noticeme":
		message.channel.send(message.author.toString() + " *owo?*");
		break;

	case "play":
		if (!args[1]) {
			message.channel.send("can't find that!");
			return;
		}

		if (!message.member.voiceChannel) {
			message.channel.send("You're not in a voice channel!");
			return;
		}

		 if (!servers[message.guild.id]) servers[message.guild.id] = {
			 queue: []
		 };

		var server = servers[message.guild.id];	

		server.queue.push(args[1]);

		if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(Connection) {
			play(Connection, message);
		});
		 message.channel.send("Song added to the queue!!")
		break;
		
	case "skip":
			var server = servers[message.guild.id];
			
			if (server.dispatcher) server.dispatcher.end();
			break;	
	
	case "stop":
			var server = servers[message.guild.id];

			if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
			break;

	case "userinfo":
			var embed = new Discord.RichEmbed()
					.addField("username", message.author.username, true)
					.addField("created on", message.author.createdAt, true)
					.addField("test title", "test description")
					.setColor(0xff0000)
					.setThumbnail(message.author.avatarURL)
				message.channel.sendEmbed(embed);
				
	}
});

bot.login(process.env.TOKEN);

