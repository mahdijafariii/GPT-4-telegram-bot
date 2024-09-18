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
    console.log(chatId,name)
    connection.query(
        `INSERT INTO users SET chatId = ?, name = ?`,
        [chatId, name],
        function (err, results) {
            console.log(results);
        }
    );
}

module.exports = {registerUser}
