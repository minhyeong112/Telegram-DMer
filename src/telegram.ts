import { WebDriver, By, until, Key } from 'selenium-webdriver';
import { getBrowser } from './browser';

/**
 * Send a message to a Telegram user
 * @param userId The Telegram user ID or username
 * @param message The message to send
 * @returns A promise that resolves to true if the message was sent successfully
 */
export async function sendMessage(userId: string, message: string): Promise<boolean> {
  console.log(`Sending message to ${userId}: ${message}`);
  
  let driver: WebDriver;
  
  try {
    // Get browser instance
    driver = await getBrowser();
    
    // Remove @ from userId if present, then add it back to ensure proper format
    const cleanUserId = userId.startsWith('@') ? userId.substring(1) : userId;
    
    // Navigate directly to Telegram Web K version with the username
    await driver.get(`https://web.telegram.org/k/#@${cleanUserId}`);
    console.log(`Navigated to https://web.telegram.org/k/#@${cleanUserId}`);
    
    // Wait for the page to load (longer wait to ensure everything is ready)
    await driver.sleep(8000);
    
    // Get the current URL to see if we're in the right place
    const currentUrl = await driver.getCurrentUrl();
    console.log(`Current Telegram Web URL: ${currentUrl}`);
    
    // Find message input and send message - try multiple selectors
    console.log('Looking for message input');
    
    // List of possible message input selectors
    const messageInputSelectors = [
      '.input-message-input',
      'div[contenteditable="true"]',
      'div.composer-input-wrapper textarea',
      'div[role="textbox"]',
      'div.composer textarea',
      'div.input-message-container div[contenteditable="true"]',
      'textarea[placeholder*="Message"]',
      'div[data-placeholder*="Message"]'
    ];
    
    let messageInput = null;
    for (const selector of messageInputSelectors) {
      try {
        console.log(`Trying selector: ${selector}`);
        await driver.sleep(1000); // Give a bit more time for elements to load
        const elements = await driver.findElements(By.css(selector));
        if (elements.length > 0) {
          console.log(`Found message input with selector: ${selector}`);
          messageInput = elements[0];
          break;
        }
      } catch (err) {
        console.log(`Selector ${selector} failed`);
      }
    }
    
    if (!messageInput) {
      // If we still can't find the message input, try to look for any input or textarea
      console.log('Trying generic input selectors');
      try {
        const inputs = await driver.findElements(By.css('input, textarea, [contenteditable="true"]'));
        if (inputs.length > 0) {
          console.log('Found generic input element');
          messageInput = inputs[0];
        }
      } catch (err) {
        console.log('Generic input selector failed');
      }
    }
    
    if (!messageInput) {
      throw new Error('Could not find message input');
    }
    
    // Clear any existing text and send message
    await messageInput.clear();
    await messageInput.sendKeys(message);
    console.log('Entered message text');
    
    // Wait a moment before sending
    await driver.sleep(1000);
    
    // Send the message using Enter key
    await messageInput.sendKeys(Key.RETURN);
    console.log('Pressed Enter to send message');
    
    // Note: We removed the send button click attempt to prevent double-sending
    
    // Wait for message to be sent
    await driver.sleep(2000);
    
    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}
