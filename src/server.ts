import app from './app';
import pool from './app/config/db';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Test the database connection
    const client = await pool.connect();
    console.log('🚀 Database connected successfully via Pool!');
    client.release();

    app.listen(PORT, () => {
      console.log(`Server is running smoothly on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

bootstrap();
