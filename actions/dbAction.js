const mysql = require('mysql2');
const {raw} = require("mysql2");
const knex = require("./../config/db")



const registerUser = async (chatId, name) => {
    const hasUser = await knex("users").where({chatId : chatId}).first();
    if(!hasUser){
        await knex("users").insert({chatId : chatId,name : name})
        }
}

const incRequestCount = async (chatId) => {
    const user = await knex("users").where({chatId : chatId}).first();
        if(user){
            await knex("users").update({freeCount : (user.freeCount + 1)}).where({chatId : user.chatId});
        }
}

const getFreeCount = async (chatId) => {
    const user = await knex("users").where({chatId : chatId}).first()
    return user.freeCount;
}

module.exports = {registerUser , incRequestCount, getFreeCount}
