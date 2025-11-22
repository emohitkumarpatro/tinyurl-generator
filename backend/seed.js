import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const sampleLinks = [
];

async function seedDatabase() {
    const client = await pool.connect();

    try {
        console.log('🌱 Starting database seeding...\n');

        for (const link of sampleLinks) {
            // Check if link already exists
            const checkResult = await client.query(
                'SELECT code FROM links WHERE code = $1',
                [link.code]
            );

            if (checkResult.rows.length > 0) {
                console.log(`⏭️  Skipping "${link.code}" - already exists`);
                continue;
            }

            // Insert the link
            await client.query(
                `INSERT INTO links (code, original_url, click_count, created_at, last_clicked_at)
                 VALUES ($1, $2, $3, $4, $5)`,
                [link.code, link.original_url, link.click_count, link.created_at, link.last_clicked_at]
            );

            console.log(`✅ Added "${link.code}" → ${link.original_url} (${link.click_count} clicks)`);
        }

        console.log('\n🎉 Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase();
