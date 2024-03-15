const { SlashCommandBuilder, SlashCommandMentionableOption } = require('@discordjs/builders');
const { QueueRepeatMode } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

const RED_COLOR = 0xff3333;
const GREEN_COLOR = 0x32CD32;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Nauci engleski i ce znas sta radi ovo"),

    execute: async({client, interaction}) => {
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

        queue.toggleShuffle(!queue.isShuffling);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(GREEN_COLOR)
                    .setDescription(`ne znam`)
            ]
        })
    }
}