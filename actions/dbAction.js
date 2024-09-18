const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'gpt-bot',
});
connection.connect((err) => {
    if (err) {
        console.error('error in connect to db ', err);
        return;
    }
    console.log('db is connected !');
});

const registerUser = (chatId, name) => {
    connection.query(`SELECT * FROM users WHERE chatId = ?`,[chatId],function(err ,result){
        if(!result.length){
            connection.query(`INSERT INTO users SET chatId = ?, name = ?`, [chatId, name]);
        }
    })
}

const incRequestCount = (chatId) => {
    connection.query(`SELECT * FROM users WHERE chatId = ?`,[chatId],function(err ,result){
        if(result.length){
            const user= result[0];
            console.log(user)
            connection.query(`UPDATE users SET freeCount = ? WHERE chatId = ?`, [(user.freeCount + 1), chatId]);
        }
    })
}

module.exports = {registerUser , incRequestCount}
