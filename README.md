# Telegram DMer

A simple TypeScript application that sends Telegram messages from your account and updates Airtable cells with the status.

## Features

- Sends messages from your Telegram account (not a bot)
- Updates Airtable cells with the status of the message (Sent/Failed)
- Configurable to use either your business or personal Telegram account
- Simple HTTP server to receive requests from Airtable automations

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Telegram account
- Airtable account with API access
- ngrok (for exposing your local server to the internet)

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
4. Get your Telegram API credentials:
   - Go to https://my.telegram.org/auth
   - Log in with your phone number
   - Go to "API development tools"
   - Create a new application
   - Copy the "App api_id" and "App api_hash" to your `.env` file

5. Edit the `.env` file with your credentials:
   ```
   TELEGRAM_API_ID=your_api_id
   TELEGRAM_API_HASH=your_api_hash
   TELEGRAM_PHONE=your_phone_number
   TELEGRAM_ACCOUNT=business  # 'business' or 'personal'
   AIRTABLE_API_KEY=your_airtable_api_key
   ```

6. Install ngrok:
   - Download from https://ngrok.com/download
   - Sign up for a free account
   - Get your auth token and run `ngrok config add-authtoken YOUR_TOKEN`

## First Run (Authentication)

The first time you run the application, you'll need to authenticate with Telegram:

1. Build and run the application:
   ```
   npm run build
   npm start
   ```
2. You'll be prompted to enter the code sent to your Telegram account
3. After successful authentication, a session string will be generated
4. Add this session string to your `.env` file as `TELEGRAM_SESSION_STRING`

## Using with ngrok

1. Start the server:
   ```
   npm start
   ```

2. In a separate terminal, start ngrok to expose your local server:
   ```
   npm run ngrok
   ```
   or
   ```
   ngrok http 3000
   ```

3. ngrok will provide a public URL (e.g., `https://abc123.ngrok-free.app`) that you can use in your Airtable automation

## Airtable Automation Setup

1. In Airtable, create a new automation
2. Choose a trigger (e.g., "When record matches conditions")
3. Add a "Run script" action
4. Use the following script (replace with your actual ngrok URL):
   ```javascript
   const config = input.config();
   const { telegramId, message, cellUrl } = config;

   // Your ngrok URL
   const serverUrl = 'https://your-ngrok-url.ngrok-free.app';

   const response = await fetch(serverUrl, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       telegramId,
       message,
       airtableUrl: cellUrl
     })
   });

   const result = await response.json();
   return result;
   ```
5. Configure the input variables to map to your Airtable fields

## Development

- Run in development mode:
   ```
   npm run dev
   ```
- Build the TypeScript code:
   ```
   npm run build
   ```
- Monitor ngrok traffic:
   Visit `http://127.0.0.1:4040` in your browser

## Notes

- This is a simple implementation that simulates sending Telegram messages and updating Airtable cells
- To implement actual functionality, you would need to:
  - Use a Telegram client library like `telegram-td` to send real messages
  - Use the Airtable API client to update real cells
- The ngrok URL will change each time you restart ngrok (unless you have a paid plan)

## License

ISC
