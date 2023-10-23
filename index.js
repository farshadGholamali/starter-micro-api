const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
// import { readFile } from "fs";

// Replace with your Telegram Bot API token
const telegramToken = '6003357095:AAHiunJVzyhV5iEiBRvqjJyCB90rGn4K58g';

// Create a new Telegram bot
const bot = new TelegramBot(telegramToken, { polling: true });

// Replace with the API endpoint that provides the dollar price
// const apiUrl = 'http://api.navasan.tech/latest/?api_key=freeArfPq2n8bO3o2iMpGp1MzK4esDgJ';
const apiUrl = 'assets/price.json';
// Function to get the dollar price from the API
async function getExchangeData() {
    try {
        const data = JSON.parse(fs.readFileSync(apiUrl, 'utf8'));

        // const response = await axios.get(`${apiUrl}`);

        // Adjust this based on your API response structure
        // const dollarPrice = response.data;
        return data;
    } catch (error) {
        console.error('Error fetching dollar price:', error);
        return 'Error fetching dollar price.';
    }
}

// Function to send the dollar price to the Telegram group
async function sendDollarPriceToGroup(chatId) {
    const exchangeData = await getExchangeData();
    const { harat_naghdi_buy: dollarPrice, dirham_dubai, sekkeh } = exchangeData

    bot.sendMessage(chatId, `
    قیمت دلار: ${formatPrice(dollarPrice.value)}
    درهم: ${formatPrice(dirham_dubai.value)}
    سکه: ${formatPrice(sekkeh.value)}
    `);
}

// Replace with your Telegram group chat ID
const groupChatId = '-1002083559719';

sendDollarPriceToGroup(groupChatId)
// Schedule sending the dollar price to the group at a specific interval (e.g., every hour)
// 3600000 milliseconds = 1 hour
setInterval(() => sendDollarPriceToGroup(groupChatId), 1000);

function formatPrice(price) {
    return price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}