const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oprem')
        .setDescription('Odgovara sa "Pa Zakitim!"')
    ,

    async execute({client, interaction}) {
        await interaction.reply('Pa Zakitim!');
    }
}