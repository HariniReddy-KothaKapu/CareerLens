# CareerLens - Complete Setup Instructions

## Automated Setup (Recommended)

I've created automated setup scripts for you!

### For Windows:

1. Open Command Prompt
2. Navigate to the server folder:
   ```bash
   cd server
   ```
3. Run the setup script:
   ```bash
   setup.bat
   ```
4. Follow the prompts:
   - Enter Oracle username (press Enter for default: system)
   - Enter your Oracle password
   - Enter connection string (press Enter for default: localhost:1521/XEPDB1)

The script will:
- ✅ Test Oracle connection
- ✅ Create database tables
- ✅ Create .env file with your credentials
- ✅ Install Node.js dependencies

### For Mac/Linux:

1. Open Terminal
2. Navigate to the server folder:
   ```bash
   cd server
   ```
3. Make the script executable:
   ```bash
   chmod +x setup.sh
   ```
4. Run the setup script:
   ```bash
   ./setup.sh
   ```
5. Follow the prompts (same as Windows)

---

## After Setup Completes

### 1. Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
Server is running on port 5000
Using Oracle Database
Oracle connection pool created successfully
```

### 2. Start the Frontend (New Terminal)

```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### 3. Test the Application

1. Open browser: http://localhost:5173
2. Click "Register"
3. Create a new account
4. Login with your credentials

### 4. Verify Data in Oracle

Open SQL*Plus:
```bash
sqlplus system/your_password@localhost:1521/XEPDB1
```

Check users:
```sql
SELECT * FROM users;
```

You should see your registered user!

---

## Manual Setup (If Scripts Don't Work)

### Step 1: Create Database Tables

```bash
cd server
sqlplus system/your_password@localhost:1521/XEPDB1
```

In SQL*Plus:
```sql
@database_oracle.sql
```

### Step 2: Create .env File

Create `server/.env`:
```
PORT=5000
DB_USER=system
DB_PASSWORD=your_password
DB_CONNECTION_STRING=localhost:1521/XEPDB1
JWT_SECRET=my_secret_key_12345
```

### Step 3: Install Dependencies

```bash
cd server
npm install
```

### Step 4: Start Servers

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

---

## Troubleshooting

### "SQL*Plus not found"
- Add Oracle to PATH
- Windows: `C:\oracleXE\app\oracle\product\11.2.0\server\bin`
- Restart terminal after adding to PATH

### "Cannot connect to Oracle"
- Check if Oracle service is running
- Windows: Services → OracleServiceXE → Start
- Verify credentials and connection string

### "Instant Client not found"
- Download: https://www.oracle.com/database/technologies/instant-client/downloads.html
- Extract and add to PATH
- Restart terminal

### "Port 5000 already in use"
- Change PORT in `.env` to 5001 or another port
- Update frontend API_URL in `src/contexts/AuthContext.tsx`

---

## Project Structure

```
careerlens/
├── server/                 # Backend (Oracle + Express)
│   ├── config/
│   │   └── db.js          # Oracle connection
│   ├── routes/
│   │   ├── auth.js        # Login/Register
│   │   └── analysis.js    # Analysis history
│   ├── database_oracle.sql # Database schema
│   ├── setup.bat          # Windows setup script
│   ├── setup.sh           # Mac/Linux setup script
│   ├── .env               # Configuration (created by setup)
│   └── server.js          # Main server
│
├── src/                   # Frontend (React + TypeScript)
│   ├── contexts/
│   │   └── AuthContext.tsx # API integration
│   ├── pages/
│   ├── components/
│   └── data/
│
└── SETUP_INSTRUCTIONS.md  # This file
```

---

## What the Setup Does

1. ✅ Verifies SQL*Plus is installed
2. ✅ Tests Oracle database connection
3. ✅ Creates USERS table
4. ✅ Creates RESUME_ANALYSES table
5. ✅ Creates indexes for performance
6. ✅ Generates .env file with your credentials
7. ✅ Installs all Node.js dependencies
8. ✅ Ready to run!

---

## Next Steps After Setup

- Register a new user account
- Upload a resume PDF
- Select a target job role
- Get ATS analysis results
- View learning resources
- Check Oracle database to see stored data

---

## Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify Oracle is running
3. Test SQL*Plus connection manually
4. Check the troubleshooting section above
5. Review server logs for detailed errors
