const { SlashCommandBuilder, SlashCommandMentionableOption } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const RED_COLOR = 0xff3333;
const GREEN_COLOR = 0x32CD32;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Nastavlja trenutnu pesmu."),
    
    execute: async ({client, interaction}) => {
        setTimeout(() => interaction.deleteReply(), 15000);
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

        if(!queue.node.isPaused()) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(RED_COLOR)
                        .setDescription("Pesma nije pauzirana stoko.")
                ]
            });
        }

        queue.node.resume();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(GREEN_COLOR)
                    .setDescription("Nastavljam da ti pevam na uvce")
            ]
        });
    }
}