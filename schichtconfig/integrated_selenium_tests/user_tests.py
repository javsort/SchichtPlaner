from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
import time, json

# Define global variables
driver = None
wait = None

def login(wait, driver):
    email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "[data-test-id='email-input']")))
    password_input = driver.find_element(By.CSS_SELECTOR, "[data-test-id='password-input']")
    login_button = driver.find_element(By.CLASS_NAME, "login-btn")
    
    email_input.clear()
    email_input.send_keys("admin@example.com")  # Replace with valid admin email
    password_input.clear()
    password_input.send_keys("admin123")  # Replace with valid admin password
    login_button.click()
    
    # Wait for redirect to shift calendar page
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "company-shift-calendar-container")))
    print("Login successful!")

def navigate_to_employee_management(wait, driver):
    sidebar_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-test-id='toggle-sidebar-button']")))
    sidebar_button.click()
    
    employee_management_link = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-test-id='employeeManagement-select']")))
    employee_management_link.click()
    
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "container"))) # To update
    print("Navigated to Employee Management!")

def create_new_user_test(wait, driver):
    name_input = driver.find_element(By.CSS_SELECTOR, "[data-test-id='name-input']")
    address_input = driver.find_element(By.CSS_SELECTOR, "[data-test-id='address-input']")
    phone_input = driver.find_element(By.CSS_SELECTOR, "[data-test-id='phone-input']")
    email_input = driver.find_element(By.CSS_SELECTOR, "[data-test-id='email-input']")
    role_dropdown = driver.find_element(By.CSS_SELECTOR, "select[name='role']")
    submit_button = driver.find_element(By.CSS_SELECTOR, "[data-test-id='submit-button']")
    
    name_input.send_keys("Test User")
    address_input.send_keys("123 Test Street")
    phone_input.send_keys("123-456-7890")
    email_input.send_keys("testuser@example.com")
    
    role_dropdown.click()
    role_option = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-test-id='role-Technician-select']")))
    role_option.click()
    
    submit_button.click()

    try:
        popup_close_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Close')]")))
        popup_close_button.click()
        print("Popup closed successfully!")
    except:
        print("No popup appeared.")

    time.sleep(2)  # Ensure UI updates

    print("Employee created successfully!")
 
def update_existing_user_test(wait, driver):
    user_option = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-test-id='employee-option-6']")))
    user_option.click()
    
    phone_input = driver.find_element(By.CSS_SELECTOR, "[data-test-id='phone-input']")
    phone_input.clear()
    phone_input.send_keys("999-999-9999")
    
    submit_button = driver.find_element(By.CSS_SELECTOR, "[data-test-id='submit-button']")
    submit_button.click()
    
    time.sleep(2)
    print("Employee updated successfully!")

def delete_existing_user_test(wait, driver):
    # employee_row = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "[data-test-id='employee-row-6']")))
    delete_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, f"[data-test-id='delete-button-6']")))
    
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", delete_button)
    time.sleep(1)  # Give the browser time to adjust view

    delete_button.click()

    # Confirm deletion (if alert appears)
    alert = wait.until(EC.alert_is_present())
    alert.accept()

    time.sleep(2)
    print("Employee deleted successfully!")

def run_tests(FRONT_END_URL):
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    driver = webdriver.Chrome(options=options)
    driver.get(f"{FRONT_END_URL}/login")

    wait = WebDriverWait(driver, 10)


    login(wait, driver)
    navigate_to_employee_management(wait, driver)

    
    create_new_user_test(wait, driver)
    update_existing_user_test(wait, driver)
    delete_existing_user_test(wait, driver)

    driver.quit()