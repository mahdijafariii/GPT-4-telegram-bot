const {Telegraf, Markup} = require("telegraf");
const bot = new Telegraf("7463854933:AAHuAacVYJwHSC0wyXIiY1pO8vndd0kB_HE");
const apiToken = "156190:66a7dae19e627";
const axios = require("axios")
const knex = require("./config/db")
const redis = require("redis")
const apiUrl = `https://one-api.ir/chatgpt/?token=${apiToken}`
const client = redis.createClient();
client.connect();

const actions = require("./actions/action")
const dbAction = require("./actions/dbAction")

bot.start(async (ctx) => {
    const payload = ctx.payload;
    if (!payload.length){
        dbAction.registerUser(ctx.chat.id, ctx.chat.first_name)
        actions.mainKeyboardMenu(ctx);
    }
    else{
        const order = await knex("orders").where({id : payload}).first()
        const request = await axios.post("https://gateway.zibal.ir/v1/verify", {
            merchant: "zibal",
            trackId : order.trackId
        })

        if(request.data.result === 100){
            const nowTime = Math.floor(Date.now() / 1000);
            const endTime = nowTime + (order.period_plan * 24*60*60);
            const updateOrderId =await knex("orders").update({status : "done",started_at : nowTime, ended_at : endTime }).where({id : payload});
            ctx.reply("Nice ،Your purchase was successful💓")
        }
        else {
            ctx.reply("Invalid Operation !👎🏻")
        }
    }

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

bot.action("vip", (ctx) => {
    const chatId = ctx.chat.id;
    ctx.editMessageText("For user this bot you can choose plan and buy it! ",
        Markup.inlineKeyboard([[
            Markup.button.callback("Buy 3.5 Turbo", "plan_Turbo"),
            Markup.button.callback("Buy GPT 4", "plan_GPT4")],
            [Markup.button.callback("Buy Copilot", "plan_copilot")],
            [Markup.button.callback("Buy All engine🌿", "plan_vip")]
        ]))
})
bot.action("confirm_payment", async (ctx) => {
    const user = await knex("users").where({chatId: ctx.chat.id}).first();
    const lastOrder = await knex('orders').where({user_id: user.id}).orderBy("id", "DESC").first()
    console.log(lastOrder.amount,lastOrder.id)
    const request = await axios.post("https://gateway.zibal.ir/v1/request", {
        merchant: "zibal",
        amount: (lastOrder.amount * 10),
        callbackUrl: `https://t.me/chatgpt4mahdi_bot?start=${lastOrder.id}`,
        orderId: lastOrder.id
    })
    console.log(request.data.trackId)
    const updateOrderId =await knex("orders").update({trackId : request.data.trackId}).where({user_id : user.id}).orderBy("id" , "DESC").limit(1);
    ctx.editMessageText("Click the payment button go to payment link 💵",
        Markup.inlineKeyboard([
            Markup.button.url(`Go To Payment Link ! `, `https://gateway.zibal.ir/start/${request.data.trackId}`),
        ]))
})

bot.on('callback_query', async (ctx) => {
    const text = ctx.update.callback_query.data
    const chatId = ctx.update.callback_query.from.id;
    const user = await knex("users").where({chatId: chatId}).first();
    const planArray = ["plan_Turbo", "plan_GPT4", "plan_copilot", "plan_vip"]
    const periodPlans = ["time_7", "time_15", "time_30", "time_90"]

    if (planArray.includes(text)) {
        await knex('orders').insert({
            user_id: user.id,
            plan: text.substring(5),
            create_at: Math.floor(Date.now() / 1000)
        })
        const plans = await knex("prices").where({plan: text.substring(5)})
        const plan_7 = plans.find(plan => plan.period_time === "7")
        const plan_15 = plans.find(plan => plan.period_time === "15")
        const plan_30 = plans.find(plan => plan.period_time === "30")
        const plan_90 = plans.find(plan => plan.period_time === "90")
        actions.periodTimeSubscription(ctx, plan_7.price, plan_15.price, plan_30.price, plan_90.price);

    }
    if (periodPlans.includes(text)) {

        const lastOrder = await knex('orders').where({user_id: user.id}).orderBy("id", "DESC").first()
        const price_plan = await knex("prices").where({plan: lastOrder.plan, period_time: text.substring(5)}).first()

        await knex('orders').update({
            period_plan: text.substring(5),
            amount: price_plan.price
        }).where({user_id: user.id}).orderBy("id", "DESC").limit(1)
        actions.paymentButton(ctx)
    }
})


bot.hears("End Chat", (ctx) => {
    const userId = ctx.chat.id
    ctx.reply("I hope it was a good experience for you💓", Markup.removeKeyboard())
    client.del(`user:${userId}:action`)
    client.del(`user:${userId}:tones`)
    actions.mainKeyboardMenu(ctx);
})
bot.hears("Continue", (ctx) => {
    ctx.reply("I look forward to your next request😍", Markup.removeKeyboard())
})

bot.on("text", async (ctx) => {
    const userText = ctx.text;
    const userId = ctx.chat.id;
    const action = await client.get(`user:${userId}:action`)
    const tone = await client.get(`user:${userId}:tones`)

    if (action) {
        const freeCount = await dbAction.getFreeCount(ctx.chat.id);
        if (freeCount >= 5) {
            ctx.reply("You can not use chat Gpt for free anymore ! you should buy vip.🍂", Markup.removeKeyboard())
        } else {
            await actions.processRequest(ctx, apiUrl, userText, action, tone)
            dbAction.incRequestCount(ctx.chat.id);
        }

    } else {
        actions.mainKeyboardMenu(ctx);
    }
})


bot.launch();