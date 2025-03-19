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

def navigate_to_role_management(wait, driver):
    sidebar_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-test-id='toggle-sidebar-button']")))
    sidebar_button.click()
    
    role_management_link = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-test-id='roleManagement-select']")))
    role_management_link.click()
    
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "role-management-container")))
    print("Navigated to Role Management!")

def create_new_role_test(wait, driver):
    role_name_input = driver.find_element(By.CSS_SELECTOR, "[data-test-id='role-name-input']")
    role_name_input.send_keys("Test Role")
    
    # Toggle some permissions
    permission_checkbox_1 = driver.find_element(By.CSS_SELECTOR, "[data-test-id='permission-checkbox-ROLE_MANAGEMENT']")
    permission_checkbox_2 = driver.find_element(By.CSS_SELECTOR, "[data-test-id='permission-checkbox-EMPLOYEE_MANAGEMENT']")
    permission_checkbox_1.click()
    permission_checkbox_2.click()
    
    create_button = driver.find_element(By.CSS_SELECTOR, "[data-test-id='create-role-button']")
    create_button.click()
    
    time.sleep(2)  # Wait for changes to reflect
    print("Role created successfully!")

def update_existing_role_test(wait, driver):
    dropdown = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "select")))
    dropdown.click()
    
    role_option = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-test-id='role-Test Role-select']")))
    role_option.click()
    
    permission_checkbox = driver.find_element(By.CSS_SELECTOR, "[data-test-id='permission-checkbox-EMPLOYEE_DELETE']")
    permission_checkbox.click()
    
    save_button = driver.find_element(By.CSS_SELECTOR, "[data-test-id='save-changes-button']")
    save_button.click()

    alert = wait.until(EC.alert_is_present())
    alert.accept()
    
    time.sleep(2)
    print("Role updated successfully!")

def delete_existing_role_test(wait, driver):
    dropdown = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "select")))
    dropdown.click()
    
    role_option = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-test-id='role-Test Role-select']")))
    role_option.click()
    
    delete_button = driver.find_element(By.CSS_SELECTOR, "[data-test-id='delete-role-button']")
    delete_button.click()
    
    # Confirm deletion (if alert appears)
    alert = wait.until(EC.alert_is_present())
    alert.accept()
    
    time.sleep(2)
    print("Role deleted successfully!")

def run_tests(FRONT_END_URL):
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    driver = webdriver.Chrome(options=options)
    driver.get(f"{FRONT_END_URL}/login")

    wait = WebDriverWait(driver, 10)


    login(wait, driver)
    navigate_to_role_management(wait, driver)

    create_new_role_test(wait, driver)
    update_existing_role_test(wait, driver)
    delete_existing_role_test(wait, driver)

    driver.quit()