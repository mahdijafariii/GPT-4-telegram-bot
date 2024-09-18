const {Markup} = require("telegraf");
const axios = require("axios");
const dbAction = require("./dbAction");

const mainKeyboardMenu = (ctx)=>{
    ctx.reply("welcome to my bot dear ! " ,
        Markup.inlineKeyboard([[
            Markup.button.callback("3.5 Turbo", "Turbo"),
            Markup.button.callback("GPT 4", "GPT4")],
            [Markup.button.callback("Copilot","copilot")]
        ]))
}

const processRequest = async (ctx,apiUrl,userText,action,tone = false,dbAction)=>{
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
    await dbAction.incRequestCount(ctx.chat.id);
    ctx.reply("Your request has been successfully processed !🌿",
        Markup.keyboard([
            ['End Chat', 'Continue']
        ]).resize())
}

module.exports = {mainKeyboardMenu, processRequest}