const mysql = require('mysql')
let conn;

function connect(app) {
    return new Promise((resolve, reject) => {
        conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'northwind'
        });
        conn.connect((err) => {
            if (err) {
                conn.end()
                reject(err)
            } else {
                console.log('mysql connected.')
                app.set('con', conn);
                resolve(true);
            }
        })
    });
}

function disconn() {
    conn.end();
}

module.exports = { connect, disconn }