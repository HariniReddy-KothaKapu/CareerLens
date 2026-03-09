# Manual Setup Guide - Step by Step

Follow these steps if the automated script doesn't work.

## Step 1: Find Your SQL*Plus

Open Command Prompt and try:
```bash
where sqlplus
```

If it shows a path, SQL*Plus is installed. If not, find it manually:
- Search Windows for "sqlplus.exe"
- Common locations:
  - `C:\oracleXE\app\oracle\product\11.2.0\server\bin`
  - `C:\oracle\product\19c\dbhomeXE\bin`

## Step 2: Connect to Oracle

Use the FULL PATH to sqlplus if needed:

```bash
C:\oracleXE\app\oracle\product\11.2.0\server\bin\sqlplus.exe system/your_password
```

Or if SQL*Plus is in PATH:
```bash
sqlplus system/your_password
```

Try different connection strings:
```bash
sqlplus system/password@localhost:1521/XEPDB1
sqlplus system/password@localhost:1521/XE
sqlplus system/password
```

## Step 3: Create Tables Manually

Once connected to SQL*Plus, copy and paste these commands:

```sql
-- Create users table
CREATE TABLE users (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR2(255) NOT NULL,
  email VARCHAR2(255) UNIQUE NOT NULL,
  password VARCHAR2(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Create resume_analyses table
CREATE TABLE resume_analyses (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id NUMBER NOT NULL,
  role_id VARCHAR2(100) NOT NULL,
  role_title VARCHAR2(255) NOT NULL,
  ats_score NUMBER NOT NULL,
  matched_skills CLOB CHECK (matched_skills IS JSON),
  missing_skills CLOB CHECK (missing_skills IS JSON),
  suggestions CLOB CHECK (suggestions IS JSON),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_id ON resume_analyses(user_id);

-- Verify tables
SELECT table_name FROM user_tables WHERE table_name IN ('USERS', 'RESUME_ANALYSES');
```

You should see:
```
TABLE_NAME
--------------
USERS
RESUME_ANALYSES
```

## Step 4: Exit SQL*Plus

```sql
exit;
```

## Step 5: Create .env File

In the `server` folder, create a file named `.env` (no extension):

**Windows - Using Notepad:**
```bash
notepad .env
```

**Paste this content:**
```
PORT=5000
DB_USER=system
DB_PASSWORD=YOUR_ACTUAL_PASSWORD
DB_CONNECTION_STRING=localhost:1521/XEPDB1
JWT_SECRET=my_secret_key_12345
```

Replace `YOUR_ACTUAL_PASSWORD` with your Oracle password.

Save and close.

## Step 6: Install Node.js Dependencies

In Command Prompt (in the server folder):
```bash
npm install
```

Wait for installation to complete.

## Step 7: Start Backend Server

```bash
npm run dev
```

You should see:
```
Server is running on port 5000
Using Oracle Database
Oracle connection pool created successfully
```

## Step 8: Start Frontend (New Command Prompt)

Open a NEW Command Prompt window:
```bash
cd C:\path\to\your\careerlens
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

## Step 9: Test the Application

1. Open browser: http://localhost:5173
2. Click "Register"
3. Create account: name, email, password
4. Login

## Step 10: Verify in Oracle

Open SQL*Plus again:
```bash
sqlplus system/your_password
```

Check if user was created:
```sql
SELECT * FROM users;
```

You should see your registered user!

---

## Common Issues

### Issue: "ORA-12154: TNS:could not resolve"
**Solution:** Try simpler connection:
```bash
sqlplus system/password
```

### Issue: "ORA-01017: invalid username/password"
**Solution:** 
- Verify password
- Try: `sqlplus sys/password as sysdba`

### Issue: "Cannot find module 'oracledb'"
**Solution:**
```bash
cd server
npm install oracledb
```

### Issue: "DPI-1047: Cannot locate Oracle Client"
**Solution:** Install Oracle Instant Client:
1. Download: https://www.oracle.com/database/technologies/instant-client/downloads.html
2. Extract to `C:\oracle\instantclient_21_12`
3. Add to PATH
4. Restart Command Prompt

### Issue: Backend won't start
**Solution:** Check if Oracle is running:
- Windows Services → OracleServiceXE → Start

---

## Quick Test Commands

**Test SQL*Plus:**
```bash
sqlplus -v
```

**Test Oracle Connection:**
```bash
sqlplus system/password
```

**Test Node.js:**
```bash
node -v
npm -v
```

**Check if tables exist:**
```sql
SELECT table_name FROM user_tables;
```

---

## Success Checklist

- [ ] SQL*Plus connects successfully
- [ ] Tables created (USERS, RESUME_ANALYSES)
- [ ] .env file created with correct credentials
- [ ] npm install completed
- [ ] Backend server starts (port 5000)
- [ ] Frontend starts (port 5173)
- [ ] Can register new user
- [ ] User appears in Oracle database

---

If you complete all steps and still have issues, please share:
1. The exact error message
2. Which step failed
3. Your Oracle version
