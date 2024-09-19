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

const getUser = async (chatId) => {
    const user = await knex("users").where({chatId : chatId}).first()
    return user;
}

const checkVipAccess = async (user_Id)=>{
    const timeNow = Math.floor(Date.now() / 1000)
    const checkVip = await knex("orders")
        .whereRaw(`(started_at <= ? AND ? <= ended_at) AND plan = ? AND user_id = ?`,
            [timeNow, timeNow, 'vip', user_Id])
        .limit(1);

    console.log(checkVip)
    return checkVip;
}

const checkOtherPlan = async (user_Id,plan)=>{
    const timeNow = Math.floor(Date.now() / 1000)
    const checkPlan = await knex("orders")
        .whereRaw(`(started_at <= ? AND ? <= ended_at) AND plan = ? AND user_id = ?`,
            [timeNow, timeNow, plan, user_Id])
        .limit(1);
    console.log(checkPlan)
    return checkPlan;
}


module.exports = {registerUser , incRequestCount, getFreeCount, checkVipAccess , checkOtherPlan, getUser}
