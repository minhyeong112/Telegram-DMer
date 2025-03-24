import { config } from 'dotenv';
import { startServer } from './server';
import { initTelegram } from './telegram';
import { initAirtable } from './airtable';

// Load environment variables from .env file
config();

async function main() {
  console.log('Starting Telegram DMer...');
  
  try {
    // Initialize Telegram client
    await initTelegram();
    
    // Initialize Airtable client
    initAirtable();
    
    // Start the server
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    startServer(port);
    
    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error('Failed to start Telegram DMer:', error);
    process.exit(1);
  }
}

main();
