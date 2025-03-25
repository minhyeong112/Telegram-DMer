import express from 'express';
import { sendMessage } from './telegram';
import { updateAirtableCell } from './airtable';

interface RequestData {
  telegramId: string;
  message: string;
  airtableUrl: string;
}

/**
 * Start the HTTP server
 * @param port The port to listen on
 */
export function startServer(port: number): void {
  const app = express();
  
  // Queue for processing requests sequentially
  const requestQueue: RequestData[] = [];
  let isProcessing = false;
  
  // Function to process the next request in the queue
  async function processNextRequest() {
    if (requestQueue.length === 0 || isProcessing) {
      return;
    }
    
    isProcessing = true;
    const data = requestQueue.shift()!;
    
    try {
      console.log(`Processing request for ${data.telegramId}`);
      
      // Send message via Telegram
      const success = await sendMessage(data.telegramId, data.message);
      
      // Update Airtable cell
      const status = success ? 'Sent' : 'Failed';
      await updateAirtableCell(data.airtableUrl, status);
      
      console.log(`Completed request for ${data.telegramId}`);
    } catch (error) {
      console.error(`Error processing request for ${data.telegramId}:`, error);
    } finally {
      isProcessing = false;
      // Process the next request in the queue
      setTimeout(processNextRequest, 1000); // Add a small delay between requests
    }
  }
  
  // Parse JSON request bodies
  app.use(express.json());
  
  // Health check endpoint
  app.get('/', (req, res) => {
    res.status(200).send('Telegram DMer is running');
  });
  
  // Main endpoint for sending messages
  app.post('/', async (req, res) => {
    try {
      const data = req.body as RequestData;
      
      // Validate request data
      if (!data.telegramId || !data.message || !data.airtableUrl) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: telegramId, message, or airtableUrl'
        });
      }
      
      console.log(`Received request to send message to ${data.telegramId}`);
      
      // Add the request to the queue
      requestQueue.push(data);
      
      // Start processing if not already processing
      if (!isProcessing) {
        processNextRequest();
      }
      
      // Send immediate response
      res.status(202).json({
        success: true,
        status: 'Queued',
        message: 'Request queued for processing'
      });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
