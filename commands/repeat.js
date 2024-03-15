const { SlashCommandBuilder, SlashCommandMentionableOption } = require('@discordjs/builders');
const { QueueRepeatMode } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

const RED_COLOR = 0xff3333;
const GREEN_COLOR = 0x32CD32;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("repeat")
        .setDescription("Repeat mode, vidi subcommande za vise info")
        .addSubcommand(command => {
            return command
            .setName("off")
            .setDescription("Iskljucuje repeat mode");
        })
        .addSubcommand(command => {
            return command
            .setName("track")
            .setDescription("Ponavlja poslednju pesmu")
        })
        .addSubcommand(command => {
            return command
            .setName("queue")
            .setDescription("Ponavlja ceo queue")
        })
        .addSubcommand(command => {
            return command
            .setName("autoplay")
            .setDescription("Pusta slicne pesme kada se sve pesmu puste")
        }),

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

        let mode;

        if(interaction.options.getSubcommand() === "off") 
            mode = QueueRepeatMode.OFF;
        else if(interaction.options.getSubcommand() === "track")
            mode = QueueRepeatMode.TRACK;
        else if(interaction.options.getSubcommand() === "queue")
            mode = QueueRepeatMode.QUEUE;
        else if(interaction.options.getSubcommand() === "autoplay")
            mode = QueueRepeatMode.AUTOPLAY;

        queue.setRepeatMode(mode);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(GREEN_COLOR)
                    .setDescription(`Podesen repeat, mrzi me da pisem koja opcija je prosledjena jebi se usta`)
            ]
        })
    }
}