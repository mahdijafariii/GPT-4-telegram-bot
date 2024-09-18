const {Telegraf, Markup} = require("telegraf");
const bot = new Telegraf("7463854933:AAHuAacVYJwHSC0wyXIiY1pO8vndd0kB_HE");
const apiToken = "156190:66a7dae19e627";
const axios = require("axios")
const redis = require("redis")
const apiUrl = `https://one-api.ir/chatgpt/?token=${apiToken}`
const client = redis.createClient();
client.connect();

const actions = require("./actions/action")
const dbAction = require("./actions/dbAction")

bot.start((ctx) => {
    dbAction.registerUser(ctx.chat.id, ctx.chat.first_name)
    actions.mainKeyboardMenu(ctx);
});
bot.action("Turbo", (ctx) => {
    client.set("user:" + ctx.chat.id + ":action", "gpt3.5-turbo")
    ctx.editMessageText("Hi what can i do fo you ?")
})
bot.action("GPT4", (ctx) => {
    client.set("user:" + ctx.chat.id + ":action", "gpt4o")
    ctx.editMessageText("now choose mode of response!",
        Markup.inlineKeyboard([
            Markup.button.callback("precies", "precies"),
            Markup.button.callback("creative", "creative"),
            Markup.button.callback("balanced", "balanced"),
        ]))
})
bot.action("precies", (ctx) => {
    client.set("user:" + ctx.chat.id + ":tones", "precies")
    ctx.editMessageText("Hi what can i do fo you ?")
})
bot.action("creative", (ctx) => {
    client.set("user:" + ctx.chat.id + ":tones", "creative")
    ctx.editMessageText("Hi what can i do fo you ?")
})
bot.action("balanced", (ctx) => {
    client.set("user:" + ctx.chat.id + ":tones", "balanced")
    ctx.editMessageText("Hi what can i do fo you ?")
})
bot.action("copilot", (ctx) => {
    client.set("user:" + ctx.chat.id + ":action", "copilot")
    ctx.editMessageText("now choose mode of response!",
        Markup.inlineKeyboard([
            Markup.button.callback("precies", "precies"),
            Markup.button.callback("creative", "creative"),
            Markup.button.callback("balanced", "balanced"),
        ]))
})

bot.action("vip",(ctx)=>{
    const chatId = ctx.chat.id;
    ctx.editMessageText("For user this bot you can choose plan and buy it! " ,
        Markup.inlineKeyboard([[
            Markup.button.callback("Buy 3.5 Turbo", "plan_Turbo"),
            Markup.button.callback("Buy GPT 4", "plan_GPT4")],
            [Markup.button.callback("Buy Copilot","plan_copilot")],
            [Markup.button.callback("Buy All engine🌿","plan_vip")]
        ]))
})
bot.hears("End Chat", (ctx) => {
    const userId = ctx.chat.id
    ctx.reply("I hope it was a good experience for you💓",Markup.removeKeyboard())
    client.del(`user:${userId}:action`)
    client.del(`user:${userId}:tones`)
    actions.mainKeyboardMenu(ctx);
})
bot.hears("Continue", (ctx) => {
    ctx.reply("I look forward to your next request😍",Markup.removeKeyboard())
})

bot.on("text", async (ctx) => {
    const userText = ctx.text;
    const userId = ctx.chat.id;
    const action = await client.get(`user:${userId}:action`)
    const tone = await client.get(`user:${userId}:tones`)

    if (action) {
        const freeCount = await dbAction.getFreeCount(ctx.chat.id);
        if (freeCount >= 5) {
            ctx.reply("You can not use chat Gpt for free anymore ! you should buy vip.🍂",Markup.removeKeyboard())
        }
        else {
            await actions.processRequest(ctx, apiUrl, userText, action, tone)
            dbAction.incRequestCount(ctx.chat.id);
        }

    } else {
        actions.mainKeyboardMenu(ctx);
    }
})


bot.launch();