import knex from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const connection = hasDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DB_SSL === 'false'
            ? false
            : { rejectUnauthorized: false }
    }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };

export default knex({
    client: process.env.DB_CLIENT || 'pg',
    connection,

    pool: { min: 0, max: 10 }
});