# Telegram DMer

A simple TypeScript application that sends Telegram messages from your account and updates Airtable cells with the status using browser automation.

## What This Application Does

This application allows you to:
1. Send messages from your personal Telegram account (not a bot) to any Telegram user
2. Update Airtable cells with the status of the message (Sent/Failed)
3. Automate this process through Airtable automations

It works by controlling a Chrome browser where you're logged into both Telegram Web and Airtable, and uses browser automation to interact with these websites.

## Complete Setup Guide for Beginners

This guide assumes you have nothing installed on your computer and will walk you through every step of the setup process.

### Step 1: Install Node.js

Node.js is the runtime environment that allows you to run JavaScript code outside of a web browser.

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the "LTS" (Long Term Support) version for your operating system
3. Run the installer and follow the installation wizard
4. Accept all default settings during installation
5. To verify installation, open Command Prompt (search for "cmd" in the Start menu) and type:
   ```
   node --version
   ```
   You should see a version number like `v18.16.0`

### Step 2: Download the Project

1. If you don't have Git installed:
   - Go to [https://github.com/yourusername/telegram-dmer](https://github.com/yourusername/telegram-dmer)
   - Click the green "Code" button and select "Download ZIP"
   - Extract the ZIP file to a location on your computer (e.g., `C:\Users\YourName\Projects\Telegram DMer`)

2. If you have Git installed:
   - Open Command Prompt
   - Navigate to where you want to store the project:
     ```
     cd C:\Users\YourName\Projects
     ```
   - Clone the repository:
     ```
     git clone https://github.com/yourusername/telegram-dmer.git "Telegram DMer"
     ```
   - Navigate into the project directory:
     ```
     cd "Telegram DMer"
     ```

### Step 3: Install Project Dependencies

1. Open Command Prompt if it's not already open
2. Navigate to the project directory:
   ```
   cd C:\path\to\Telegram DMer
   ```
3. Install the required dependencies:
   ```
   npm install
   ```
   This will install all the necessary packages defined in the `package.json` file.

### Step 4: Download Chrome and ChromeDriver

The application uses a specific version of Chrome and ChromeDriver for automation. These are excluded from the GitHub repository due to their size, so you need to download them separately.

#### Download Chrome for Testing:

1. Go to [https://googlechromelabs.github.io/chrome-for-testing/](https://googlechromelabs.github.io/chrome-for-testing/)
2. Find the latest stable version
3. Download the "chrome-win64" ZIP file for Windows
4. Extract the ZIP file
5. Create a folder named `chrome-win64` in your project directory
6. Copy all the contents from the extracted folder into the `chrome-win64` folder in your project

#### Download ChromeDriver:

1. Go to [https://googlechromelabs.github.io/chrome-for-testing/](https://googlechromelabs.github.io/chrome-for-testing/)
2. Find the same version as the Chrome you downloaded
3. Download the "chromedriver-win64" ZIP file for Windows
4. Extract the ZIP file
5. Create a folder named `chromedriver-win64` in your project directory
6. Copy all the contents from the extracted folder into the `chromedriver-win64` folder in your project

### Step 5: Set Up Environment Variables

1. In your project directory, create a file named `.env` (note the dot at the beginning)
2. Open the file in a text editor (like Notepad)
3. Add the following content:
   ```
   PORT=3000
   CHROME_DEBUG_PORT=9222
   ```
4. Save the file

### Step 6: Install ngrok

ngrok is a tool that creates a secure tunnel to expose your local server to the internet, allowing Airtable to communicate with your application.

1. Go to [https://ngrok.com/download](https://ngrok.com/download)
2. Download the Windows version
3. Extract the ZIP file to a location on your computer (e.g., `C:\ngrok`)
4. Sign up for a free ngrok account at [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
5. After signing up, go to [https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
6. Copy your authtoken
7. Open Command Prompt and navigate to where you extracted ngrok:
   ```
   cd C:\ngrok
   ```
8. Configure ngrok with your authtoken:
   ```
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```
   Replace `YOUR_AUTH_TOKEN` with the token you copied

## Running the Application

### Step 1: Start Chrome with Remote Debugging

1. Open Command Prompt
2. Navigate to your project directory:
   ```
   cd C:\path\to\Telegram DMer
   ```
3. Start Chrome with remote debugging enabled:
   ```
   start "" "chrome-win64\chrome.exe" --remote-debugging-port=9222
   ```
   This will open a new Chrome window that the application will control.

### Step 2: Log in to Telegram Web and Airtable

In the Chrome window that just opened:

1. Go to [https://web.telegram.org/k/](https://web.telegram.org/k/)
2. Log in to your Telegram account
   - You may need to scan a QR code with your phone's Telegram app
   - Or enter your phone number and the verification code sent to your Telegram app

3. Open a new tab
4. Go to [https://airtable.com/](https://airtable.com/)
5. Log in to your Airtable account

**IMPORTANT:** Keep this Chrome window open and do not log out of either service. The automation will use these logged-in sessions.

### Step 3: Start the Application

1. Open a new Command Prompt window
2. Navigate to your project directory:
   ```
   cd C:\path\to\Telegram DMer
   ```
3. Start the application:
   ```
   npm run dev
   ```
4. You should see messages like:
   ```
   Starting Telegram DMer...
   Initializing browser connection...
   Browser connection established
   Server running on port 3000
   Ready to receive requests
   ```

### Step 4: Set Up ngrok

1. Open another new Command Prompt window
2. Navigate to where you installed ngrok:
   ```
   cd C:\ngrok
   ```
3. Start ngrok to expose your local server:
   ```
   ngrok http 3000
   ```
4. You should see a display that includes a "Forwarding" URL like:
   ```
   Forwarding https://abc123.ngrok-free.app -> http://localhost:3000
   ```
5. Copy this URL (e.g., `https://abc123.ngrok-free.app`) as you'll need it for the Airtable automation

## Setting Up Airtable Automation

### Step 1: Create a New Automation in Airtable

1. Open your Airtable base
2. Click on "Automations" in the top right
3. Click "Create a new automation"
4. Choose a trigger (e.g., "When record matches conditions")
5. Configure the trigger according to your needs

### Step 2: Add a "Run Script" Action

1. Click "Add action"
2. Select "Run script"
3. In the script editor, paste the following code:
   ```javascript
   const config = input.config();
   const { telegramId, message, cellUrl } = config;

   // Your ngrok URL (replace with your actual URL from ngrok)
   const serverUrl = 'https://abc123.ngrok-free.app';

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
4. Replace `https://abc123.ngrok-free.app` with your actual ngrok URL from Step 4 of "Running the Application"

### Step 3: Configure Input Variables

1. Below the script, you'll see "Input variables"
2. Add the following variables:
   - `telegramId`: The Telegram username or ID to message (e.g., @username)
   - `message`: The message content to send
   - `cellUrl`: The URL of the Airtable cell to update with the status

3. For each variable, click "Insert dynamic data" to select fields from your Airtable base

4. For `cellUrl`, you need to get the URL of the cell where you want to store the status:
   - Right-click on the cell in your Airtable base
   - Select "Copy link to cell"
   - Use this as a static value or create a formula field that constructs this URL

5. Test the automation to make sure it works

## How to Use the Application

Once everything is set up:

1. The Airtable automation will trigger based on your configured conditions
2. It will send a request to your local server through ngrok
3. The application will:
   - Navigate to Telegram Web
   - Find the user by the provided ID/username
   - Send the message
   - Navigate to the Airtable URL
   - Update the cell with "Sent" or "Failed"

## Shutting Down and Restarting

### To Shut Down:

1. In the Command Prompt window running ngrok, press `Ctrl+C` to stop ngrok
2. In the Command Prompt window running the application, press `Ctrl+C` to stop the application
3. You can close the Chrome window if you won't be using the application again soon

### To Restart:

If you need to restart the application or if you accidentally closed the Chrome window:

1. If any previous instances are still running, open Command Prompt and type:
   ```
   powershell -Command "Stop-Process -Name node -Force"
   ```
   This will kill any running Node.js processes.

2. Start Chrome with remote debugging enabled:
   ```
   start "" "chrome-win64\chrome.exe" --remote-debugging-port=9222
   ```

3. Log in to Telegram Web and Airtable in this Chrome instance

4. Start the application again:
   ```
   npm run dev
   ```

5. Start ngrok again:
   ```
   ngrok http 3000
   ```

6. Update your Airtable automation script with the new ngrok URL

## Troubleshooting

### "Cannot connect to Chrome at localhost:9222"

- Make sure Chrome is running with remote debugging enabled
- Check that you started Chrome using the command provided in the instructions
- Try restarting Chrome with the remote debugging flag

### "Failed to send Telegram message"

- Make sure you're logged into Telegram Web in the Chrome instance
- Check that the Telegram username/ID is correct
- Try keeping the Chrome window visible (not minimized)

### "Failed to update Airtable cell"

- Make sure you're logged into Airtable in the Chrome instance
- Check that the Airtable cell URL is correct
- Try visiting the URL manually in the Chrome instance to verify it works

### Messages are being sent multiple times

- Check your Airtable automation settings to ensure it's not triggering multiple times for the same record
- The application has been updated to prevent sending duplicate messages from a single request

### ngrok URL not working

- ngrok URLs change each time you restart ngrok (unless you have a paid plan)
- Make sure to update your Airtable automation script with the new URL each time you restart ngrok

## Technical Details

- The application uses TypeScript and Node.js
- It uses Selenium WebDriver to automate browser interactions
- It connects to a Chrome instance with remote debugging enabled
- It runs an Express server to receive requests from Airtable
- It processes requests sequentially to avoid conflicts

## Security Notes

- For security, don't leave Chrome with remote debugging enabled when not in use
- The application has access to your Telegram and Airtable accounts, so use it responsibly
- ngrok exposes your local server to the internet, so be cautious about what information you share
