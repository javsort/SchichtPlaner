from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time, json

import role_tests, user_tests

FRONT_END_URL = "http://localhost:3000"

def main():
    print("Welcome to the python integration tests")

    # Run the tests
    role_tests.run_tests(FRONT_END_URL)

    user_tests.run_tests(FRONT_END_URL)

if __name__ == '__main__':
    main()