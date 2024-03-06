require('dotenv').config();

const RED_COLOR = 0xff3333;
const ORANGE_COLOR = 0xff5b00;
const BLUE_COLOR = 0xb3cde0;
const PURPLE_COLOR = 0xa32cc4;
const YELLOW_COLOR = 0xffe505;

const buttonWrapper = require("./utility/buton-wraper");

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, ButtonStyle, ClientApplication } = require('discord.js');
const { Player } = require("discord-player");

const fs = require('fs');
const path = require('path');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { channel } = require('diagnostics_channel');



const client = new Client ({
   intents: ["Guilds", "GuildMessages", "GuildVoiceStates", "GuildMembers", "GuildPresences"]
});

// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

client.player.extractors.loadDefault();

// Buttons for "now playing"
const buttonData = [
    // {
    //     label: "Previous",
    //     style: ButtonStyle.Success,
    //     //function: client.commands.get("previous").execute,
    // },
    {
        label: "Pause",
        style: ButtonStyle.Primary,
        function: client.commands.get("pause").execute,
    },
    {
        label: "Resume",
        style: ButtonStyle.Primary,
        function: client.commands.get("resume").execute,
    },
    {
        label: "Skip",
        style: ButtonStyle.Success,
        function: client.commands.get("skip").execute,
    },
    {
        label: "Exit",
        style: ButtonStyle.Danger,
        function: client.commands.get("exit").execute,
    },
]


// ------------------------------- Event listeners -------------------------------

client.lastChannel = null;
client.nowPlayingMessage = null;

client.on("ready", () => {
    // Get all ids of the servers
    const guilds = client.guilds.cache.map(guild => {return {id: guild.id, name: guild.name}});

    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
    for(const guild of guilds) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
            {body: commands})
        .then(() => console.log(`Uspešno updatovane komande za guild ${guild.name}`))
        .catch(console.error);
    }
});

client.on("interactionCreate", async interaction => {
    try {
        if(interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
    
            if(!command) return;
        
            await command.execute({client, interaction});
        } else if(interaction.isButton() && interaction.customId.startsWith("btn-")) {
            const indexFromId = interaction.customId.replace("btn-", "");
            const index = parseInt(indexFromId);

            await buttonData[index].function({client, interaction});
        }
    }
    catch(error) {
        console.error(error);
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(ORANGE_COLOR)
                    .setDescription("Greska prilikom pokretanja komande, programer je slepac.")
            ]
        });
    }
});

client.on('guildMemberAdd', member => {
    const textChannels = member.guild.channels.cache.filter(ch => ch.type === 0);

    const general = textChannels.find(ch => ch.name.includes("welcome"));
    if(!general) general = textChannels.find(ch => ch.name.includes("dobrodosli"));
    if(!general) general = textChannels.find(ch => ch.name.includes("general"));
    if(!general) general = textChannels.find(ch => ch.name.includes("main"));
    if(!general) general = textChannels.find(ch => ch.name.includes("text"));
    if(!general) general = textChannels.find(ch => ch.position === 0);

    if(!general) return;

    general.send({
        embeds: [
            new EmbedBuilder()
                .setDescription(`Dobrodošao/la <@${member.id}> amzo glupi/a. Ako hoćeš da ti pevam na uvce ukucaj /play, al na fiksni ne zovi me.`)
                .setColor(PURPLE_COLOR)
                .setAuthor({name: member.displayName , iconURL: member.avatarURL()})
        ]
    })
});

client.on('guildMemberRemove', member => {
    if(member.id == client.user.id) return;
    
    const textChannels = member.guild.channels.cache.filter(ch => ch.type === 0);
    
    const general = textChannels.find(ch => ch.name.includes("welcome"));
    if(!general) general = textChannels.find(ch => ch.name.includes("dobrodosli"));
    if(!general) general = textChannels.find(ch => ch.name.includes("general"));
    if(!general) general = textChannels.find(ch => ch.name.includes("main"));
    if(!general) general = textChannels.find(ch => ch.name.includes("text"));
    if(!general) general = textChannels.find(ch => ch.position === 0);
    
    if(!general) return;

    general.send({
        embeds: [
            new EmbedBuilder()
                .setDescription(`Pička ${member} je izašao iz servera`)
                .setColor(PURPLE_COLOR)
                .setAuthor({name: member.displayName , iconURL: member.avatarURL()})
        ]
    });
});

client.on('guildCreate', guild => {
    const textChannels = guild.channels.cache.filter(ch => ch.type === 0);

    textChannels.forEach(ch => console.log(`name: ${ch.name}, position: ${ch.position}`));

    const general = textChannels.find(ch => ch.name.includes("welcome"));
    if(!general) general = textChannels.find(ch => ch.name.includes("dobrodosli"));
    if(!general) general = textChannels.find(ch => ch.name.includes("general"));
    if(!general) general = textChannels.find(ch => ch.name.includes("main"));
    if(!general) general = textChannels.find(ch => ch.name.includes("text"));
    if(!general) general = textChannels.find(ch => ch.position === 0);

    if(!general) return;

    general.send({
        embeds: [
            new EmbedBuilder()
                .setColor(YELLOW_COLOR)
                .setDescription(`POZDRAV SVIMA! Ja sam ${client.user} bot koji **majnuje bitcoin** od svih korisnika servera. 
                                Umem i da puštam muziku ako pozoveš **/play**.
                                Ako ne želiš da ti majnujem u pozadini pozovi komandu **/spusimvutru**, medjutim ta komanda je samo za pičke.`)
                .setThumbnail(client.user.avatarURL())
        ]
    })

    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
        {body: commands})
    .then(() => console.log(`Uspešno updatovane komande za guild ${guild.name}`))
    .catch(console.error);
});

// client.on('messageDelete', (message) => {
//     if(message.author.id === client.user.id) return;
//     message.channel.send(`<@${message.author.id}> Šta brišes poruku siso šta to kriješ?`)
// });

// Now playing - logic
client.player.events.on('playerStart', (queue, error) => {
    if(!queue) return;

    if(client.nowPlayingMessage != null)
    {
        client.nowPlayingMessage.delete().catch(error => console.log(error));
        client.nowPlayingMessage = null;
    }

    drawNowPlaying(queue);
});

async function drawNowPlaying(queue) {
    const currSong = queue.currentTrack;

    const buttons = [];
    for(let i in buttonData) { 
        buttons[i] = 
            new ButtonBuilder()
                .setCustomId(`btn-${i}`)
                .setLabel(buttonData[i].label)
                .setStyle(buttonData[i].style)
    }

    client.messageObject = {
        embeds: [
            new EmbedBuilder()
                .setAuthor({name: `${queue.guild.name} - Trenutno Pevam: `, iconURL: queue.guild.iconURL()})
                .setColor(BLUE_COLOR)
                .setDescription(`**[${currSong.description}](${currSong.url})** tražio <@${currSong.requestedBy.id}>`)
        ],

        components: buttonWrapper(buttons),
    }

    client.nowPlayingMessage = await client.lastChannel.send(client.messageObject);
}

client.player.events.on('emptyQueue', (queue, error) => {
    if(client.nowPlayingMessage != null)
    {
        client.nowPlayingMessage.delete().catch(error => console.log(error));
        client.nowPlayingMessage = null;
    }

    client.lastChannel.send({
        embeds: [
            new EmbedBuilder()
                .setDescription("Sve pesme sam otpevao, pusti me da se odmorim malo pa nastavljam")
                .setColor(YELLOW_COLOR)
                .setAuthor({name: "Pauza za topli obrok", iconURL: queue.guild.iconURL()})
        ]
    })
});

client.player.events.on('emptyChannel', (queue, error) => {
    client.timeoutID = setTimeout(() => {
        
        client.lastChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Kanal je prazan već 15 minuta, moram da izađem ostavili ste me samog")
                    .setColor(YELLOW_COLOR)
                    .setAuthor({name: "Tužan sam", iconURL: queue.guild.iconURL()})
            ]
        })

        queue.delete();
        if(client.nowPlayingMessage != null)
        {
            client.nowPlayingMessage.delete().catch(error => console.log(error));
            client.nowPlayingMessage = null;
        }
    }, 15 * 60 * 1000);
});

client.player.events.on('channelPopulate', (queue, error) => {
    if(client.timeoutID)
    {
        clearTimeout(client.timeoutID);
        client.timeoutID = null;
    }
});

// client.player.events.on('playerFinish', (queue, error) => {
//     if(client.nowPlayingMessage != null)
//     {
//         client.nowPlayingMessage.delete();
//         client.nowPlayingMessage = null;
//     }
// });

// Error event handlers
client.player.events.on('playerError', (queue, error) => {
    //if(client.nowPlayingMessage)
        //client.nowPlayingMessage.delete();
    // Emitted when the audio player errors while streaming audio track
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});

client.player.events.on('error', (queue, error) => {
    //if(client.nowPlayingMessage)
        //client.nowPlayingMessage.delete();
    // Emitted when the player queue encounters error
    console.log(`General player error event: ${error.message}`);
    console.log(error);
});

client.on('error', (error) => {
    console.error(error);
});


client.login(process.env.TOKEN);