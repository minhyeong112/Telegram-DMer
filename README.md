# Telegram DMer

A simple TypeScript application that sends Telegram messages from your account and updates Airtable cells with the status using browser automation.

## Features

- Sends messages from your Telegram account (not a bot)
- Updates Airtable cells with the status of the message (Sent/Failed)
- Simple HTTP server to receive requests from Airtable automations
- Uses browser automation to interact with Telegram Web and Airtable

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Chrome browser (included in the project)
- ngrok (for exposing your local server to the internet)

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Install ngrok globally if you haven't already:
   ```
   npm install -g ngrok
   ```

## Running the Application

1. If you have a previous instance running, kill the Node.js process:
   ```
   powershell -Command "Stop-Process -Name node -Force"
   ```

2. Start Chrome with remote debugging enabled using the included Chrome executable:
   ```
   start "" "chrome-win64\chrome.exe" --remote-debugging-port=9222
   ```

3. Log in to Telegram Web (https://web.telegram.org/k/) and Airtable in this Chrome instance
   - This is a critical step! The automation will use your logged-in sessions

4. Run the application in development mode:
   ```
   npm run dev
   ```
   - You should see "Browser connection established" and "Server running on port 3000"

5. In a separate terminal, start ngrok to expose your local server:
   ```
   ngrok http 3000
   ```

6. ngrok will provide a public URL (e.g., `https://abc123.ngrok-free.app`) that you can use in your Airtable automation
   - Note this URL as you'll need it for the Airtable script

## Airtable Automation Setup

1. In Airtable, create a new automation
2. Choose a trigger (e.g., "When record matches conditions")
3. Add a "Run script" action
4. Use the following script (replace with your actual ngrok URL):
   ```javascript
   const config = input.config();
   const { telegramId, message, cellUrl } = config;

   // Your ngrok URL (replace with your actual URL from ngrok)
   const serverUrl = 'https://d6c8-124-122-193-54.ngrok-free.app';

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
5. Configure the input variables to map to your Airtable fields:
   - `telegramId`: The Telegram username or ID to message (e.g., @username)
   - `message`: The message content to send
   - `cellUrl`: The URL of the Airtable cell to update with the status

## How It Works

1. The application connects to your existing Chrome session where you're already logged in to Telegram and Airtable
2. When a request is received from Airtable:
   - The application navigates to Telegram Web
   - Searches for the user by the provided ID/username
   - Sends the message
   - Navigates to the Airtable URL
   - Updates the cell with the status (Sent/Failed)

## Troubleshooting

- If you see "cannot connect to chrome at localhost:9222", make sure Chrome is running with remote debugging enabled
- Make sure you're logged into both Telegram Web and Airtable in the Chrome instance
- Check that the ngrok URL in your Airtable script matches the current ngrok URL
- If messages aren't being sent, check the console output for errors
- If the first attempt fails but subsequent attempts work, try keeping the Chrome window visible (not minimized)
- If messages are being sent multiple times, check your Airtable automation settings to ensure it's not triggering multiple times for the same record

## Restarting the Process

If you need to restart the application or if you accidentally closed the Chrome window:

1. Kill the Node.js process:
   ```
   powershell -Command "Stop-Process -Name node -Force"
   ```

2. Start Chrome with remote debugging enabled:
   ```
   start "" "chrome-win64\chrome.exe" --remote-debugging-port=9222
   ```

3. Log in to Telegram Web (https://web.telegram.org/k/) and Airtable in this Chrome instance

4. Start the application again:
   ```
   npm run dev
   ```

## Notes

- This implementation uses browser automation to interact with Telegram Web and Airtable
- The ngrok URL will change each time you restart ngrok (unless you have a paid plan)
- For security, don't leave Chrome with remote debugging enabled when not in use
