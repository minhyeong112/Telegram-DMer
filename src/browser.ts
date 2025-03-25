import { Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import * as path from 'path';

let driver: WebDriver | null = null;

/**
 * Initialize and get the WebDriver instance
 * @returns WebDriver instance
 */
export async function getBrowser(): Promise<WebDriver> {
  if (driver) {
    return driver;
  }

  try {
    console.log('Initializing browser connection...');
    
    // Get Chrome debug port from environment variables
    const debugPort = process.env.CHROME_DEBUG_PORT || '9222';
    
    // Set up Chrome options to connect to existing Chrome instance
    const options = new Options();
    options.addArguments('--disable-extensions');
    options.debuggerAddress(`localhost:${debugPort}`);
    
    // Path to ChromeDriver
    const chromeDriverPath = path.resolve(
      process.cwd(),
      'chromedriver-win64',
      'chromedriver-win64',
      'chromedriver.exe'
    );
    
    // Create and return the WebDriver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .setChromeService(new (await import('selenium-webdriver/chrome')).ServiceBuilder(chromeDriverPath))
      .build();
    
    console.log('Browser connection established');
    return driver;
  } catch (error) {
    console.error('Failed to initialize browser:', error);
    throw error;
  }
}

/**
 * Close the browser connection
 */
export async function closeBrowser(): Promise<void> {
  if (driver) {
    try {
      await driver.quit();
      driver = null;
      console.log('Browser connection closed');
    } catch (error) {
      console.error('Failed to close browser:', error);
    }
  }
}
