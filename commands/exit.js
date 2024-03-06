const { SlashCommandBuilder, SlashCommandMentionableOption } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const RED_COLOR = 0xff3333;
const GREEN_COLOR = 0x32CD32;
const ORANGE_COLOR = 0xff5b00;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("A šta misliš da ovo radi konju jedan."),
    
    execute: async ({client, interaction}) => {
        await interaction.deferReply();

        if(client.nowPlayingMessage != null)
        {
            client.nowPlayingMessage.delete().catch(error => console.log(error));
            client.nowPlayingMessage = null;
        }

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

        queue.delete();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(ORANGE_COLOR)
                    .setDescription("I šta ti sad znači?")
            ]
        });
    }
}