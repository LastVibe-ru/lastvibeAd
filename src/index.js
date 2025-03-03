const { Client, GatewayIntentBits, Events, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const TOKEN = 'MTM0NjA4ODIyMTEyOTQ0NTQ1Nw.GwqQmv.HeEgjsQAiT1fXrObIndC_SvYJ26RPpdW9OiY9E';

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async message => {
    if (message.content === '!botCreate') {
        const button = new ButtonBuilder()
            .setCustomId('openModal')
            .setLabel('Написать объявление')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        const embed = new EmbedBuilder()
            .setTitle('📰 Оставить объявление')
            .setDescription('По кнопке ниже вы можете рассказать всему серверу о своем магазине, проекте и т.д. \nДля получения url картинки, просто отправьте ее кому-нибудь в дискорде и нажмите ПКМ, "Копировать ссылку" или "Copy link"\n\n**После отправки редактировать сообщение будет нельзя! Для удаления обратитесь в <#1338533231582249072>.**')
            .setImage('https://media.discordapp.net/attachments/1299609343829737512/1346097727448289342/11.jpg?ex=67c6f2b3&is=67c5a133&hm=0eb3e69d9586c5dc13c1918ba0987472d76cd58b06a0850b28264a9d1ad026d4&=&format=webp&width=1073&height=434');

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on(Events.InteractionCreate, async interaction => {
    try {
        if (interaction.customId === 'openModal') {
            const modal = new ModalBuilder()
                .setCustomId('adModal')
                .setTitle('Составление объявления');

            const titleInput = new TextInputBuilder()
                .setCustomId('title')
                .setLabel('Заголовок')
                .setStyle(TextInputStyle.Short);

            const descriptionInput = new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Описание')
                .setStyle(TextInputStyle.Paragraph);

            const urlInput = new TextInputBuilder()
                .setCustomId('url')
                .setLabel('Url картинки')
                .setRequired(false)
                .setStyle(TextInputStyle.Short);

            const titleRow = new ActionRowBuilder().addComponents(titleInput);
            const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput);
            const urlRow = new ActionRowBuilder().addComponents(urlInput);

            modal.addComponents(titleRow, descriptionRow, urlRow);

            await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === 'adModal') {
            const title = interaction.fields.getTextInputValue('title');
            const description = interaction.fields.getTextInputValue('description');
            const url = interaction.fields.getTextInputValue('url');

            const adChannel = client.channels.cache.get('1346096725466546199');
            if (!adChannel) {
                return interaction.reply({ content: 'Канал не найден.', ephemeral: true });
            }

            if (url && url.trim() !== ''){
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.displayName })
                    .setTitle(title)
                    .setDescription(description)
                    .setImage(url);

                await adChannel.send({ embeds: [embed] });
                await interaction.reply({ content: 'Ваше объявление было успешно отправлено!', ephemeral: true });
            } else {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.displayName })
                    .setTitle(title)
                    .setDescription(description);

                await adChannel.send({ embeds: [embed] });
                await interaction.reply({ content: 'Ваше объявление было успешно отправлено!', ephemeral: true });
            }
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Произошла ошибка, попробуйте позже.', ephemeral: true });
    }
});

client.login(TOKEN);
