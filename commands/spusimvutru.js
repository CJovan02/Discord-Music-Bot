const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

const BLUE_COLOR = 0xb3cde0;
const GREEN_COLOR = 0x32CD32;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spusimvutru')
        .setDescription('KORISTITI NA SVOJU ODGOVORNOST!')
    ,

    async execute({client, interaction}) {
        const embed = new EmbedBuilder();
        embed
            .setColor(BLUE_COLOR)
            .setDescription(`Spušim svu vutru
            Spušim svu vutru
            Spušim svu vutru
            Spušim svu vutru
            Spušim svu vutru
            Spušim svu vutru
            Spušim, spušim, spušim svu vutru
            Spušim svu vutru
            Spušim svu vutru
            Spušim, spušim svu vutru
            Spušim svu vutru
            Spušim svu vutru
            Spušim svu vutru
            Spušim svu vutru
            Spušim, spušim svu vutru
            Spušim,spušim, spušim svu vutru
            Vutru,vutru, spušim svu vutru
            Spušim svu vutru
            Spušim, spušim svu vutru
            
            
            A sada, spušim svu vutru, drugi deo
            
            
            Spušim svu vutru
            Spušim svu vutru
            Spušim, spušim svu vutru
            Spušim svu vutru
            Spušim svu vutru
            Spušim, spušim svu vutru
            Spušim svu vutru
            Vutru, spušim svu vutru, 1.0
            Vutru, spušim vutru, vutru
            Vutru, vutru, vutru, vutru
            Spušim svu vutru, vutru, vutru, vutru
            Spušim svu vutru, spušim svu vutru
            Vutru, vutru
            You might also like
            Herbarium
            Ajs Nigrutin
            Kilo Granja Lešim
            Ajs Nigrutin
            
            
            A sada, spušim svu vutru treći deo
            
            
            Spušim svu vutru
            Spušim svu vutru
            Spušim, spušim svu vutru
            Spušim vutru, spušim vutru
            Spušim svu vutru
            Vutru spušim, svu vutru spušim
            Vutru spušim, svu vutru spušim
            Vutru spušim, svu vutru spušim
            Svu vutru spušim, svu vutru spušim
            Svu vutru spušim, svu vutru spušim
            Svu vutru spušim
            Svu, svu, svu, svu, svu, svu, svu, svu, svu, svu
            Svu, svu, svu, svu, svu, svu, svu
            Vutru, vutru, vutru, spušim
            
            
            A sada, spušim svu vutru četvrti deo
            
            
            Spu, spušim svu vutru
            Spušim, spušim,spušim svu vutru
            Spušim svu vutru, spušim svu vutru
            Vutru spušim, vutru, vutru, pušim vutru
            
            Pušim vutru 43 pušim vutru 23 konekšn
            Bakalar, bakalar, kečap, senf i ajvar
            Pušim vutru`)

        interaction.member.send({embeds: [embed]});

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(GREEN_COLOR)
                    .setDescription(`${interaction.member} je upravo najebo`)
            ]
        })
    }
}