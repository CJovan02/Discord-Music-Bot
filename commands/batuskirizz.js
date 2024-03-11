const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

const PURPLE_COLOR = 0xa32cc4;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('batuskirizz')
        .setDescription('Nesto sto nema na ovaj svet')
    ,

    async execute({client, interaction}) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(PURPLE_COLOR)
                    .setDescription(`ČESTITAM **<@524243409846665216>** ŠMEKERU, proradio je batuški rizz, samo tako nastavi i će umočis`)
            ]
        });
    }
}