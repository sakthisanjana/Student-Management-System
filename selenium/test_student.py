import unittest
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class StudentManagementTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        project_root = Path(__file__).resolve().parent.parent
        handler = partial(SimpleHTTPRequestHandler, directory=str(project_root))
        cls.http_server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.server_thread = Thread(target=cls.http_server.serve_forever, daemon=True)
        cls.server_thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.http_server.shutdown()
        cls.http_server.server_close()
        cls.server_thread.join()

    def setUp(self):
        options = webdriver.ChromeOptions()
        # Uncomment for headless browser mode:
        # options.add_argument("--headless=new")
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 10)
        # Open index.html directly; AngularJS calls the API on localhost:3000.
        index_file = Path(__file__).resolve().parent.parent / "index.html"
        self.driver.get(index_file.as_uri())

    def tearDown(self):
        self.driver.quit()

    def test_create_and_read_student(self):
        name = "Selenium Student"
        regno = "SEL" + __import__("time").strftime("%H%M%S")
        self.driver.find_element(By.XPATH, "//button[contains(., 'Add Student')]").click()
        self.driver.find_element(By.ID, "name").send_keys(name)
        self.driver.find_element(By.ID, "regno").send_keys(regno)
        self.driver.find_element(By.ID, "department").send_keys("Information Technology")
        self.driver.find_element(By.ID, "save-button").click()
        self.wait.until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".message"), "Student added successfully!"))
        self.driver.find_element(By.XPATH, "//button[contains(., 'View Students')]").click()
        self.wait.until(EC.presence_of_element_located((By.XPATH, f"//td[normalize-space()='{name}']")))
        self.assertIn(name, self.driver.find_element(By.TAG_NAME, "body").text)
        print("Testcase passed: student created and displayed successfully.")

    def test_xml_displays_student_table(self):
        self.driver.get(f"http://127.0.0.1:{self.http_server.server_port}/xml/students.xml")

        table = self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "table")))
        rows = table.find_elements(By.TAG_NAME, "tr")
        self.assertEqual(len(rows), 4)
        self.assertIn("Arun Kumar", table.text)
        self.assertIn("Information Technology", table.text)
        print("Testcase passed: XML students displayed in a table.")

if __name__ == "__main__":
    unittest.main(verbosity=2)
