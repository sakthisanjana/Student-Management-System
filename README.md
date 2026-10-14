# Student Management System: AngularJS + MongoDB CRUD

This ZIP follows the uploaded `web.txt` structure and includes a complete backend with **Create, Read, Update, and Delete** operations.

## Project layout
- `index.html`, `style.css`, `app.js`: AngularJS frontend
- `backend/server.js`: Express + Mongoose API with CRUD endpoints
- `backend/package.json`: backend dependencies
- `xml/students.xml`, `xml/students.dtd`, `xml/students.xsl`: XML, DTD, XSL
- `selenium/test_student.py`: basic Selenium create/read test

## Requirements
- Node.js installed (the provided source code uses Express/Mongoose)
- MongoDB Community Server running locally, or an Atlas connection URI
- Python and Selenium for the Selenium test
- Chrome browser

## Run on Windows
Open two PowerShell terminals.

### Terminal 1: start the backend
```powershell
cd backend
npm install
npm start
```
Expected messages:
`MongoDB connected successfully to studentDB`
`Backend running at http://localhost:3000`

If using Atlas instead of local MongoDB, set the environment variable before `npm start`:
```powershell
$env:MONGO_URI="mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/studentDB?retryWrites=true&w=majority"
npm start
```
Replace the placeholders with your own connection string. Never commit database credentials.

### Terminal 2: open the frontend
For a simple lab, open `index.html` in Chrome. AngularJS is loaded from Google's CDN, so internet access is needed. Keep the backend terminal running.
The frontend calls `http://localhost:3000/students`.

## CRUD API
- `GET /students`: list students (Read)
- `POST /students`: add student (Create)
- `PUT /students/:id`: update student (Update)
- `DELETE /students/:id`: delete student (Delete)

The register number must be unique. The MongoDB database is `studentDB`; Mongoose creates the `students` collection on first insert.

## Selenium
Install Selenium if needed:
```powershell
python -m pip install selenium
```
From the project root, run:
```powershell
python -m unittest discover -s selenium -v
```
Keep the backend running while the test runs. Selenium needs Chrome and a working ChromeDriver/Selenium Manager setup.

## XML and DTD
Keep the XML, DTD and XSL files together in `xml`. `students.xml` references `students.dtd` and `students.xsl`.




1. Check Node.js  -  node -v
If it says the command is not recognized, install Node.js from the official website:
Download Node.js for Windows

2. Check npm   -   npm -v
3. Check Python for Selenium  - python --version or py --version
4. Check MongoDB  - 
Check whether a MongoDB Windows service exists
Get-Service *mongo*
If you see a service named MongoDB, check its status.
- If it is Running, continue.
- If it is Stopped, start it: net start MongoDB
Step 3: Install backend dependencies
Enter the backend folder:  cd backend
    npm install
    npm start
Step 6: Open the frontend
cd "C:\Users\Hp\Downloads\Student_Management_AngularJS_MongoDB_CRUD"(not go the backend folder)
start index.html

Step 7: Set up and run Selenium testing
Open a third PowerShell window.
Go to the project folder: cd "C:\Users\Hp\Downloads\Student_Management_AngularJS_MongoDB_CRUD"

Install Selenium if it is not already installed:
python -m pip install selenium
Run your test:  python .\selenium\test_student.py

To run xml file use :  http://127.0.0.1:5500/xml/students.xml

if error at npm start means do this 

Step 1: Find the process using port 3000
Copy this command into PowerShell:
Get-NetTCPConnection -LocalPort 3000 -State Listen |Select-Object LocalAddress, LocalPort, OwningProcess


You should see a PID (process ID), for example 18420.
Step 2: Identify the process
Replace 18420 with the actual PID shown on your computer:
Get-Process -Id 18420


If it shows node, that is likely your existing backend.

Step 3: Stop the duplicate server
Only if you confirmed that PID belongs to your old Node.js backend, run:
Stop-Process -Id 18420 -Force


Replace 18420 with your actual PID.
Step 4: Start the backend once
Make sure you are in the correct folder:
cd "C:\Users\Hp\Downloads\Student_Management_AngularJS_MongoDB_CRUD\backend"
npm start

