import { config } from 'dotenv';
import { startServer } from './server';
import { getBrowser, closeBrowser } from './browser';

// Load environment variables from .env file
config();

async function main() {
  console.log('Starting Telegram DMer...');
  
  try {
    // Initialize browser connection
    await getBrowser();
    
    // Set up graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down...');
      await closeBrowser();
      process.exit(0);
    });
    
    // Start the server
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    startServer(port);
    
    console.log(`Server running on port ${port}`);
    console.log('Ready to receive requests');
  } catch (error) {
    console.error('Failed to start Telegram DMer:', error);
    await closeBrowser();
    process.exit(1);
  }
}

main();
