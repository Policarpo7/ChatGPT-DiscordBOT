//Criando o bot do discord que interaja com o server
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

//Preparando conexão com a OPENAI API
const { Configuration , OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

//Checkar quando a mensagem chega ao discord
client.on('messageCreate', async function(message){
    try {
        if(message.author.bot) return;

        const gptResponse = await openai.createCompletion({
            model: "davinci",
            prompt: `ChatGPT is a friendly chatbot.\n\
    ChatGPT: Oi, Como voce esta?\n\
    ${message.author.username}: ${message.content}\n\
    ChatGPT:`,
            temperature: 0.9,
            max_tokens: 100,
            stop: ["ChatGPT:", "Gustavo Policarpo:"],
        })

        message.reply(`${gptResponse.data.choices[0].text}`);
        return;
    } catch(err){
        console.log(err)
    }
});

//logar o bot no discord

client.login(process.env.DISCORD_TOKEN);
console.log("PolicarpoGPT esta online no discord")