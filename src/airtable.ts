import { WebDriver, By, until, Key } from 'selenium-webdriver';
import { getBrowser } from './browser';

/**
 * Extract the base view URL from the full Airtable URL
 * @param url The full Airtable cell URL
 * @returns The base view URL
 */
function getAirtableViewUrl(url: string): string {
  // Example URL: https://airtable.com/appPolYp9eaiqaKKy/tbloOnoLADWQqH2jq/viwRS68PcsEc3nENN/recKwdIFdNygQj6Wu/fldpgW5cCMOzW3s01
  
  try {
    // Extract IDs from URL
    const urlParts = url.split('/');
    
    // Find the parts that start with the Airtable prefixes
    const baseId = urlParts.find(part => part.startsWith('app')) || '';
    const tableId = urlParts.find(part => part.startsWith('tbl')) || '';
    const viewId = urlParts.find(part => part.startsWith('viw')) || '';
    
    // Construct the view URL
    const viewUrl = `https://airtable.com/${baseId}/${tableId}/${viewId}`;
    console.log(`Constructed Airtable view URL: ${viewUrl}`);
    
    return viewUrl;
  } catch (error) {
    console.error('Failed to parse Airtable URL:', error);
    // Return the original URL if parsing fails
    return url;
  }
}

/**
 * Update an Airtable cell with a status value
 * @param url The Airtable cell URL
 * @param status The status to set ('Sent' or 'Failed')
 * @returns A promise that resolves when the cell is updated
 */
export async function updateAirtableCell(url: string, status: 'Sent' | 'Failed'): Promise<boolean> {
  console.log(`Updating Airtable cell with status: ${status}`);
  
  let driver: WebDriver;
  
  try {
    // Get browser instance
    driver = await getBrowser();
    
    // Navigate directly to the Airtable URL
    await driver.get(url);
    console.log(`Navigated to Airtable URL: ${url}`);
    
    // Wait for the page to load
    await driver.sleep(5000);
    
    // Simply type the status and press Enter
    await driver.actions().sendKeys(status).perform();
    await driver.sleep(500);
    await driver.actions().sendKeys(Key.RETURN).perform();
    console.log(`Entered status: ${status}`);
    
    // Wait for save to complete
    await driver.sleep(2000);
    
    return true;
  } catch (error) {
    console.error('Failed to update Airtable cell:', error);
    return false;
  }
}
