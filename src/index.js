// This code is not ideal
// Please send issue - https://github.com/LastVibe-ru/lastvibeAd/issues

const { Client, GatewayIntentBits, Events, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle,
    Embed
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const fs = require('fs');

const express = require('express');

const app = express();
const port = 8091;

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

// Don't try using api in commit hystory
// We create new api >_<

const TOKEN = config.api_key;

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);

    startServer();
});

function startServer(){
    app.get('/ban', async (req, res) => {
        const { name, reason, key } = req.query;
        
        if (!name || !reason || !key){
            res.status(400).send("Bad gateway");

            return;
        }

        if (key != config.api_key){
            res.status(400).send("Unauthorized");

            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Игрок ${name} забанен`)
            .setDescription(`Причина: ${reason}`);

        const banChanal = client.channels.cache.get(config.ban_channel);

        await banChanal.send({ embeds: [embed] });
        
    });

    app.get('/unban', async (req, res) => {
        const {name, key} = req.query;

        if (!name || !key){
            res.status(400).send("Bad gateway");

            return;
        }

        if (key != config.api_key){
            res.status(400).send("Unauthorized")

            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Игрок ${name} разбанен`)

        const banChanal = client.channels.cache.get(config.ban_channel);

        await banChanal.send({ embeds: [embed] });
    });

    app.listen(port, () => {
        console.log(`Server started at ${port}`);
    });
}

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

    if (message.content === '!botQue'){
        const buttonQue = new ButtonBuilder()
            .setCustomId('openModalQue')
            .setLabel('Предложить')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(buttonQue);

        const embedQue = new EmbedBuilder()
            .setTitle('📩 Предложить идею')
            .setDescription('По кнопке ниже вы можете предложить идею для развития сервера, а другие игроки проголосовать. \nИдеи понравившиеся нам или набравшие много положительных реакций будут добавлены. \n\nПишите обдуманно и не слишком размыто.');

        await message.channel.send({ embeds: [embedQue], components: [row] });
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

        if (interaction.customId === 'openModalQue'){
            const modal = new ModalBuilder()
                .setCustomId('modalQue')
                .setTitle('Предложение идеи');

            const titleInput = new TextInputBuilder()
                .setCustomId('idea')
                .setLabel('Опишите вашу идею')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Я думаю на сервере бы хорошо смотрелось...');

            const row = new ActionRowBuilder().addComponents(titleInput);

            modal.addComponents(row);

            await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === 'adModal') {
            const title = interaction.fields.getTextInputValue('title');
            const description = interaction.fields.getTextInputValue('description');
            const url = interaction.fields.getTextInputValue('url');

            const adChannel = client.channels.cache.get(config.ad_channel);
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

        if (interaction.isModalSubmit() && interaction.customId === 'modalQue'){
            const idea = interaction.fields.getTextInputValue('idea');

            const queChannel = client.channels.cache.get(config.que_channel);
            if (!queChannel){
                return interaction.reply({ content: 'Упс, ошибка. Скоро починим', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle(`Идея от ${interaction.user.displayName}`)
                .setDescription(idea)
                .setFooter({ text: 'Оцените идею реакцией 👍 или 👎' });

            const msg = await queChannel.send({ embeds: [embed] });
            await msg.react('👍');
            await msg.react('👎');

            await interaction.reply({ content: 'Ваша идея была успешно отправлена!', ephemeral: true });
        }

        if (interaction.customId === 'addRoleAds') {
            const member = interaction.member;
            const role = interaction.guild.roles.cache.find(r => r.name === 'Advertisements');

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

        if (interaction.customId === 'addRoleEvents') {
            const member = interaction.member;
            const role = interaction.guild.roles.cache.find(r => r.name === 'Events');

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
            const role = interaction.guild.roles.cache.find(r => r.name === 'Contents');

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
