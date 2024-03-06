const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Embed } = require('discord.js');
const { QueryType } = require('discord-player');

const RED_COLOR = 0xff3333;
const GREEN_COLOR = 0x32CD32;

module.exports = {
    data:
        new SlashCommandBuilder()
        .setName("play")
        .setDescription("Pušta pesmu sa YouTube-a, prihvata search term-ove, URL pesme i URL playlist-e")
        .addStringOption(option => {
            return option
                .setName("query")
                .setDescription("Ukucaj search-tearm, URL od pesme ili playlist-e")
                .setRequired(true)
        }),

        execute: async ({client, interaction}) => {
            await interaction.deferReply();

            if(!client.lastChannel) client.lastChannel = interaction.channel;

            if(!interaction.member.voice.channel) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(RED_COLOR)
                            .setDescription("Moraš da budes u voice channel-u debilu")
                    ]});
            }

            const queue = await client.player.nodes.create(interaction.guild, {leaveOnEmpty: false, leaveOnEnd: false});

            if(!queue.connection) await queue.connect(interaction.member.voice.channel, );

            let embed = new EmbedBuilder();
            let result, songs;
            const query = interaction.options.getString("query");

            if(query.includes("https://www.youtube.com/")) {

                result = await client.player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                });

                if(result.tracks.length === 0) {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(RED_COLOR)
                                .setDescription("Nije pronađena pesma sa zadatim URL-om")
                        ]
                    });
                }

                songs = result.tracks[0];
            }
            else if(query.includes("https://youtube.com/playlist")) {
                result = await client.player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                });

                if(result.tracks.length === 0) {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(RED_COLOR)
                                .setDescription("Nije pronađena playlista")
                        ]
                    });
                }

                songs = result.playlist;
            }
            else {
                result = await client.player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_SEARCH
                });

                if(result.tracks.length === 0) {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(RED_COLOR)
                                .setDescription("Nije pronađena pesma")
                        ]
                    });
                }

                songs = result.tracks[0];
            }
            
            await queue.addTrack(songs);

            if(!queue.isPlaying()) await queue.node.play();

            embed
                .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
                .setColor(0x32CD32)
                .setDescription(`Dodato **[${songs.description}](${songs.url})** u red.`)
                .setThumbnail(songs.thumbnail)
                .setFooter({text: `Duration: ${songs.duration}`});
            
            await interaction.editReply({
                embeds: [embed]
            })
        }
}