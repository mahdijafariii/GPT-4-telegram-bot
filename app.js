const { Telegraf , Markup } = require("telegraf");
const bot = new Telegraf("7463854933:AAHuAacVYJwHSC0wyXIiY1pO8vndd0kB_HE");
const apiToken = "156190:66a7dae19e627";
const axios = require("axios")
const redis = require("redis")
const apiUrl = `https://one-api.ir/chatgpt/?token=${apiToken}`
const client = redis.createClient();
client.connect();

const actions = require("./actions/action")
const dbAction = require("./actions/dbAction")

bot.start((ctx)=>{
    dbAction.registerUser(ctx.chat.id , ctx.chat.first_name)
    actions.mainKeyboardMenu(ctx);
});
bot.action("Turbo",(ctx)=>{
    client.set("user:"+ctx.chat.id+":action" , "gpt3.5-turbo")
    ctx.editMessageText("Hi what can i do fo you ?")
})
bot.action("GPT4",(ctx)=>{
    client.set("user:"+ctx.chat.id+":action" , "gpt4o")
    ctx.editMessageText("now choose mode of response!",
        Markup.inlineKeyboard([
            Markup.button.callback("precies","precies"),
            Markup.button.callback("creative","creative"),
            Markup.button.callback("balanced","balanced"),
        ]))
})
bot.action("precies",(ctx)=>{
    client.set("user:"+ctx.chat.id+":tones" , "precies")
    ctx.editMessageText("Hi what can i do fo you ?")
})
bot.action("creative",(ctx)=>{
    client.set("user:"+ctx.chat.id+":tones" , "creative")
    ctx.editMessageText("Hi what can i do fo you ?")
})
bot.action("balanced",(ctx)=>{
    client.set("user:"+ctx.chat.id+":tones" , "balanced")
    ctx.editMessageText("Hi what can i do fo you ?")
})
bot.action("copilot",(ctx)=>{
    client.set("user:"+ctx.chat.id+":action" , "copilot")
    ctx.editMessageText("now choose mode of response!",
        Markup.inlineKeyboard([
            Markup.button.callback("precies","precies"),
            Markup.button.callback("creative","creative"),
            Markup.button.callback("balanced","balanced"),
        ]))})
bot.hears("End Chat",(ctx)=>{
    const userId = ctx.chat.id
    Markup.removeKeyboard();
    ctx.reply("I hope it was a good experience for you💓")
    client.del(`user:${userId}:action`)
    client.del(`user:${userId}:tones`)
    actions.mainKeyboardMenu(ctx);
})
bot.hears("Continue",(ctx)=>{
    Markup.removeKeyboard();
    ctx.reply("I look forward to your next request😍")
})

bot.on("text", async (ctx)=> {
    const userText = ctx.text;
    const userId = ctx.chat.id;
    const action = await client.get(`user:${userId}:action`)
    const tone = await client.get(`user:${userId}:tones`)

    if (action) {
        ctx.reply("Your request is on processing😊")

        if (action == "gpt3.5-turbo") {
            const response = await axios.get(`${apiUrl}&action=${action}&q=` + encodeURIComponent(userText));
            ctx.reply(response.data.result[0])
        } else if (action == "gpt4o") {
            const response = await axios.get(`${apiUrl}&action=${action}&q=` + encodeURIComponent(userText) + `tones=${tone}`);
            ctx.reply(response.data.result[0])
        } else if (action == "copilot") {
            const response = await axios.get(`${apiUrl}&action=${action}&q=` + encodeURIComponent(userText) + `tones=${tone}`);
            ctx.reply(response.data.result[0].message)
        }

        ctx.reply("Your request has been successfully processed !🌿",
            Markup.keyboard([
                Markup.button.callback("End Chat"),
                Markup.button.callback("Continue")]
            ))
    }
    else {
        actions.mainKeyboardMenu(ctx);
    }
})


bot.launch();