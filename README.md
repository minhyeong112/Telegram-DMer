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

## Usage

1. Start the server:
   ```
   npm start
   ```
2. The server will listen for POST requests at `http://localhost:3000` (or the port specified in your `.env` file)
3. Send a POST request with the following JSON body:
   ```json
   {
     "telegramId": "username_or_id",
     "message": "Your message here",
     "airtableUrl": "https://airtable.com/appXXX/tblXXX/viwXXX/recXXX/fldXXX"
   }
   ```
4. The application will:
   - Send the message to the specified Telegram user
   - Update the Airtable cell with "Sent" or "Failed"
   - Return a JSON response with the status

## Airtable Automation Setup

1. In Airtable, create a new automation
2. Choose a trigger (e.g., "When record matches conditions")
3. Add a "Run script" action
4. Use the following script (adjust as needed):
   ```javascript
   const telegramId = input.config().telegramId;
   const message = input.config().message;
   const cellUrl = input.config().cellUrl;
   
   const response = await fetch('http://your-server:3000', {
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

## License

ISC
