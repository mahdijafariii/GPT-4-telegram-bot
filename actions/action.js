const {Markup} = require("telegraf");
const axios = require("axios");

const mainKeyboardMenu = (ctx)=>{
    ctx.reply("welcome to my bot dear ! " ,
        Markup.inlineKeyboard([[
            Markup.button.callback("3.5 Turbo", "Turbo"),Markup.button.callback("GPT 4", "GPT4")],
            [Markup.button.callback("Copilot","copilot"),Markup.button.callback("Buy VIP🌿","vip")],
        ]))
}

const periodTimeSubscription = (ctx,price_7,price_15,price_30,price_90)=>{
    ctx.editMessageText("How many days subscription do you want? " ,
        Markup.inlineKeyboard([[
            Markup.button.callback(`7 days price : ${price_7}`, "time_7"),Markup.button.callback(`7 days price : ${price_15}`, "time_15")],
            [Markup.button.callback(`30 days price : ${price_30}`,"time_30"),Markup.button.callback(`7 days price : ${price_90}`,"time_90")],

        ]))
}

const paymentButton = (ctx)=>{
    ctx.editMessageText("Click the payment button to purchase a subscription 💵" ,
        Markup.inlineKeyboard([
            Markup.button.callback(`Buy 💸`, "confirm_payment"),
        ]))
}

const goToPaymentLink = (ctx, trackId)=>{

}



const processRequest = async (ctx,apiUrl,userText,action,tone = false)=>{
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
            ['End Chat', 'Continue']
        ]).resize())
}

module.exports = {mainKeyboardMenu, processRequest ,periodTimeSubscription, paymentButton ,goToPaymentLink}