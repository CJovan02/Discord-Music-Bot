const { SlashCommandBuilder, SlashCommandMentionableOption } = require('@discordjs/builders');
const { EmbedBuilder, calculateUserDefaultAvatarIndex } = require('discord.js');

const AMETHYST_COLOR = 0xa45ee5;
const RED_COLOR = 0xff3333;
const PURPLE_COLOR = 0xa32cc4;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Prikazuje sledeće 10 pesme"),
    
        execute: async ({ client, interaction }) => {
            await interaction.deferReply();

            const queue = client.player.nodes.get(interaction.guild);
    
            if(!queue) {
                return await interaction.editReply({
                    embeds: [
                         new EmbedBuilder()
                            .setColor(RED_COLOR)
                            .setDescription("Nijedna pesma nije puštena svršljo glupi.")
                    ]
                });
            }
    
            const queueString = queue.tracks.toArray().slice(0, 10).map((song, i) => {
                return `**${i+1})** [${song.title}](${song.url}) tražio <@${song.requestedBy.id}>`
            }).join("\n")
    
            const currentSong = queue.currentTrack;
    
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({name: `Red pesama za ${interaction.guild.name}`, iconURL: interaction.user.avatarURL()})
                        .setColor(PURPLE_COLOR)
                        .setDescription(`**• Trenutna:**\n` + 
                            (currentSong ? `[${currentSong.title}](${currentSong.url}) tražio <@${currentSong.requestedBy.id}>` : "Nope :(") +
                            `\n\n**• Slede:**\n${queueString}`
                        )
                        .setThumbnail(currentSong.setThumbnail)
                ]
            })
        }
}