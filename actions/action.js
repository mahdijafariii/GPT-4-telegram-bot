const {Markup} = require("telegraf");
const mainKeyboardMenu = (ctx)=>{
    ctx.reply("welcome to my bot dear ! " ,
        Markup.inlineKeyboard([[
            Markup.button.callback("3.5 Turbo", "Turbo"),
            Markup.button.callback("GPT 4", "GPT4")],
            [Markup.button.callback("Copilot","copilot")]
        ]))
}

module.exports = {mainKeyboardMenu}