import { createServer, IncomingMessage, ServerResponse } from 'http';
import { sendMessage } from './telegram';
import { updateAirtableCell } from './airtable';

interface RequestData {
  telegramId: string;
  message: string;
  airtableUrl: string;
}

export function startServer(port: number): void {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // Only accept POST requests
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end('Method Not Allowed');
      return;
    }

    try {
      // Parse request body
      const body = await parseRequestBody(req);
      const data = JSON.parse(body) as RequestData;

      // Validate request data
      if (!data.telegramId || !data.message || !data.airtableUrl) {
        res.statusCode = 400;
        res.end('Bad Request: Missing required fields');
        return;
      }

      console.log(`Received request to send message to ${data.telegramId}`);

      // Send message via Telegram
      const success = await sendMessage(data.telegramId, data.message);

      // Update Airtable cell
      const status = success ? 'Sent' : 'Failed';
      await updateAirtableCell(data.airtableUrl, status);

      // Send response
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success, status }));
    } catch (error) {
      console.error('Error processing request:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port);
}

function parseRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      resolve(body);
    });
    
    req.on('error', (err) => {
      reject(err);
    });
  });
}
