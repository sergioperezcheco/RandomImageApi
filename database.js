const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./random-image-api.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

// 创建表
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS image_sets (
        id TEXT PRIMARY KEY,
        urls TEXT
    )`, (err) => {
        if (err) {
            console.error('Could not create table', err);
        } else {
            console.log('Table created or already exists');
        }
    });
});

module.exports = db;
