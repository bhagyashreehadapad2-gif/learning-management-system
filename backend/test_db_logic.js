const { db, initDb } = require('./db');

async function test() {
    try {
        console.log('Testing db.js connection and init...');
        await initDb();
        console.log('db.js test completed successfully!');
    } catch (err) {
        console.error('db.js test failed:', err);
    } finally {
        process.exit();
    }
}

test();
