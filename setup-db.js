const mysql = require('mysql2/promise');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) envVars[key.trim()] = value.join('=').trim();
});

async function setupDB() {
    console.log('Connecting to TiDB Cloud without database to create one...');
    const connection = await mysql.createConnection({
        host: envVars.DB_HOST?.trim(),
        user: envVars.DB_USER?.trim(),
        password: envVars.DB_PASSWORD?.trim(),
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
        },
    });

    try {
        console.log('Creating database camp_feedback IF NOT EXISTS...');
        await connection.query('CREATE DATABASE IF NOT EXISTS camp_feedback');
        
        console.log('Switching to camp_feedback database...');
        await connection.query('USE camp_feedback');

        console.log('Creating feedback table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                content TEXT,
                is_appropriate BOOLEAN
            );
        `);

        console.log('Database setup complete!');
    } catch (e) {
        console.error('Error during database setup:', e);
    } finally {
        await connection.end();
    }
}

setupDB();
