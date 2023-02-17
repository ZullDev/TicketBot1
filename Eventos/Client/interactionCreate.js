const Discord = require('discord.js');
const Client = require('../../index');
const Config = require('../../config.json');
const { RichEmbed, PermissionFlagsBits } = require('discord.js')

const logo = 'https://cdn.discordapp.com/attachments/1069703760827396186/1075529232274436136/Logotipo_Shopping_Online_Basico_1.png'
const tickets = []

Client.on("interactionCreate", async interaction => {

    if(interaction.customId === "Seletor_Menu"){
        let Embed = new Discord.EmbedBuilder()
        Embed.setTitle('**Speex Store**')
        Embed.setColor(0x2f3136)
        Embed.setThumbnail(logo)
        Embed.setDescription(`Olá querido cliente, Para abrir um ticket é necessário estar ciente que, Prestamos atendimento Para:

        📧 Suporte Geral
        💳 Compras Gerais
        
        Lembrando: Quando o Ticket é gerado a equipe do suporte é mencionada, É só informar o que deseja e aguardar.`)
        Embed.setFooter({ text: 'Copyright 2023 • Speex Store ©', iconURL: logo })
        
        let Menu = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setEmoji("🎫")
            .setLabel("Abrir Ticket")
            .setCustomId('open_ticket')
            .setStyle(Discord.ButtonStyle.Primary)
        )
        return interaction.reply({ embeds: [Embed], components: [Menu] , ephemeral: true});
    }
    if (interaction.isButton()){
        if(interaction.customId === 'open_ticket'){
            if(tickets.includes(interaction.user.id)){
                interaction.reply({ content: 'Você já possui um ticket aberto! Feche-o e tente novamente'})
                setTimeout(function timer(){interaction.deleteReply()},5000)
                return
            }
            tickets.push(interaction.user.id)
            interaction.guild.channels.create({
                name: `ticket-${interaction.user.id}`,
                parent: Config.categoria_tickets,
                type: Discord.ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [ PermissionFlagsBits.ViewChannel],
                        allow: [PermissionFlagsBits.ViewChannel]
                    }
                ]
            }).then(async Canal =>{
                let Embed = new Discord.EmbedBuilder()
                    Embed.setTitle("**Speex Store**")
                    Embed.setColor(0x2f3136)
                    //Embed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 1024 })})
                    Embed.setDescription(`
                    ${interaction.guild.roles.cache.get(Config.cargosup)}
                    Seu ticket foi aberto, nossa equipe já foi mencionada aguarde

                    **Lembrando que nossa equipe só atende das 10h até 20h!**`)
                    Embed.setThumbnail(interaction.user.displayAvatarURL({ size: 1024 }))
                    Embed.setFooter({ text: 'Copyright 2023 • Speex Store ©', iconURL: logo })
                    Embed.setTimestamp()
    
                    Canal.send({ content: `${interaction.user}`, embeds: [Embed], components: []}).then(message => {
                        Button = new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Link)
                                .setLabel('Ir para o canal')
                                .setURL(message.url)
                        );

                         interaction.reply({ content: `Ticket aberto com sucesso!`, components: [Button]})
                         setTimeout(function timer(){interaction.deleteReply()},5000)

                        let Botao = new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                            .setEmoji("❌")
                            .setLabel("Fechar Ticket")
                            .setCustomId('close_ticket')
                            .setStyle(Discord.ButtonStyle.Primary)
                        )
                        message.reply({ components: [Botao] , ephemeral: true});
                    })
            })                 
        }
        if(interaction.customId === 'close_ticket'){
        let Embed = new Discord.EmbedBuilder()

        Embed.setColor(0x2f3136)
        Embed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 1024 })})
        Embed.setDescription(`O atendimento(${interaction.user.id}) foi encerrado por ${interaction.user.username}`)
        Embed.setFooter({ text: 'Copyright 2023 • Speex Store ©', iconURL: logo })
        tickets.shift(interaction.user.id)
        Embed.setTimestamp()
        setTimeout(function timer(){interaction.channel.delete()},5000)                 

        return interaction.reply({ embeds: [Embed] });
        }
    }
});