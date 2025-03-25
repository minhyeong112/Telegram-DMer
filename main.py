import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

path = 'C:\\Users\\migue\\code\\tinder\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe'
service = Service(executable_path=path)
web = 'https://tinder.com/'

options = Options()
options.add_experimental_option("debuggerAddress", "localhost:9222")

driver = webdriver.Chrome(service=service, options=options)

number_of_swipes = 1000

driver.get(web)
time.sleep(3)

for i in range(number_of_swipes):
    like_button = driver.find_element(by='xpath', value='//button//span[text()="Like"]')
    driver.execute_script("arguments[0].click();", like_button)
    time.sleep(1)

    try:
        its_match_window = driver.find_element(by='xpath', value='//textarea[@placeholder="Say something nice!"]')
        its_match_window.send_keys('Hi I''m Miguel, nice to meet you~')
        time.sleep(1)
        send_message_button = driver.find_element(by='xpath', value='//button//span[text()="Send"]')
        send_message_button.click()
        time.sleep(1)

        close_its_match_window = driver.find_element(by='xpath', value='//button[@title="Back to Tinder"]')
        close_its_match_window.click()
        time.sleep(1)
    except:
        pass

    try:
        box = driver.find_element(by='xpath', value='//button//span[text()="Maybe Later"] | //button//span[text()="Not interested"] | /html/body/div[2]/div/div/button[2]/div[2]/div[2]/div')
        box.click()
    except:
        pass