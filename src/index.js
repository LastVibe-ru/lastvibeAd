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

    if (message.content === '!botInfo') {
        const btnAds = new ButtonBuilder()
            .setCustomId('addRoleAds')
            .setLabel('📢')
            .setStyle(ButtonStyle.Primary);

        const btnEvents = new ButtonBuilder()
            .setCustomId('addRoleEvents')
            .setLabel('🎈')
            .setStyle(ButtonStyle.Success);

        const btnContent = new ButtonBuilder()
            .setCustomId('addRoleContent')
            .setLabel('🎥')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(btnAds, btnContent, btnEvents);

        const embed = new EmbedBuilder()
            .setDescription('Нажмите на 📢, чтобы получать оповещения об объявлений от игроков.\n\nНажмите на 🎥, чтобы получать оповещения о контенте, видео и стримах от игроков.\n\nНажмите на 🎈, чтобы получать оповещения о ивентах от игроков.');

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
                .setPlaceholder('Открытие магазина...')
                .setStyle(TextInputStyle.Short);

            const descriptionInput = new TextInputBuilder()
                .setCustomId('description')
                .setPlaceholder('Сегодня...')
                .setLabel('Описание')
                .setStyle(TextInputStyle.Paragraph);

            const urlInput = new TextInputBuilder()
                .setCustomId('url')
                .setLabel('Url картинки')
                .setPlaceholder('https://media.discordapp.net/...')
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

        if (interaction.customId === 'addRoleAds') {
            const member = interaction.member; // Используем interaction.member напрямую
            const role = interaction.guild.roles.cache.find(r => r.name === 'advertisements');

            if (role) { // Проверяем, существует ли роль
                if (member.roles.cache.has(role.id)) { // Используем role.id
                    await member.roles.remove(role).catch(console.error);
                    await interaction.reply({ content: 'Роль убрана', ephemeral: true });
                } else {
                    await member.roles.add(role).catch(console.error);
                    await interaction.reply({ content: 'Роль выдана', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'Ошибка, попробуйте позднее', ephemeral: true });
            }
        }

        if (interaction.customId === 'addRoleEvents') {
            const member = interaction.member;
            const role = interaction.guild.roles.cache.find(r => r.name === 'events');

            if (role) {
                if (member.roles.cache.has(role.id)) {
                    await member.roles.remove(role).catch(console.error);
                    await interaction.reply({ content: 'Роль убрана', ephemeral: true });
                } else {
                    await member.roles.add(role).catch(console.error);
                    await interaction.reply({ content: 'Роль выдана', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'Ошибка, попробуйте позднее', ephemeral: true });
            }
        }

        if (interaction.customId === 'addRoleContent') {
            const member = interaction.member;
            const role = interaction.guild.roles.cache.find(r => r.name === 'contents');

            if (role) {
                if (member.roles.cache.has(role.id)) {
                    await member.roles.remove(role).catch(console.error);
                    await interaction.reply({content: 'Роль убрана', ephemeral: true});
                } else {
                    await member.roles.add(role).catch(console.error);
                    await interaction.reply({content: 'Роль выдана', ephemeral: true});
                }
            } else {
                await interaction.reply({content: 'Ошибка, попробуйте позднее', ephemeral: true});
            }
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Произошла ошибка, попробуйте позже.', ephemeral: true });
    }
});

client.login(TOKEN);
