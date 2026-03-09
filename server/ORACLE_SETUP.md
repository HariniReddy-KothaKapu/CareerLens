# CareerLens with Oracle Database (SQL*Plus)

Complete setup guide for using Oracle Database with SQL*Plus.

## Prerequisites

- Oracle Database (XE, Standard, or Enterprise Edition)
- SQL*Plus (comes with Oracle Database)
- Node.js (v14 or higher)

## Step 1: Install Oracle Database

### Option A: Oracle Database XE (Free, Recommended for Development)
1. Download Oracle Database XE from: https://www.oracle.com/database/technologies/xe-downloads.html
2. Install following the wizard
3. Remember the password you set for SYSTEM/SYS users

### Option B: Oracle Database on Docker
```bash
docker pull container-registry.oracle.com/database/express:latest
docker run -d -p 1521:1521 -e ORACLE_PWD=YourPassword container-registry.oracle.com/database/express:latest
```

## Step 2: Connect to SQL*Plus

Open Command Prompt/Terminal and connect:

```bash
sqlplus system/your_password@localhost:1521/XEPDB1
```

Or if using default installation:
```bash
sqlplus system/your_password
```

## Step 3: Create Database Tables

In SQL*Plus, run the SQL script:

```sql
@database_oracle.sql
```

Or copy-paste the contents of `database_oracle.sql` directly into SQL*Plus.

Verify tables were created:
```sql
SELECT table_name FROM user_tables;
```

You should see:
- USERS
- RESUME_ANALYSES

## Step 4: Configure Environment Variables

Create `.env` file in the `server` directory:

```bash
PORT=5000
DB_USER=system
DB_PASSWORD=your_oracle_password
DB_CONNECTION_STRING=localhost:1521/XEPDB1
JWT_SECRET=change_this_to_random_secret_key
```

**Connection String Format:**
- `localhost:1521/XEPDB1` - For Oracle XE (Pluggable Database)
- `localhost:1521/XE` - For older Oracle XE versions
- `localhost:1521/ORCL` - For Oracle Standard/Enterprise

## Step 5: Install Oracle Instant Client (Required for Node.js)

### Windows:
1. Download Oracle Instant Client: https://www.oracle.com/database/technologies/instant-client/downloads.html
2. Extract to `C:\oracle\instantclient_21_12`
3. Add to PATH environment variable:
   ```
   C:\oracle\instantclient_21_12
   ```

### macOS:
```bash
brew tap InstantClientTap/instantclient
brew install instantclient-basic
```

### Linux:
```bash
# Download and extract
wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linux.x64-21.12.0.0.0dbru.zip
unzip instantclient-basic-linux.x64-21.12.0.0.0dbru.zip
sudo mv instantclient_21_12 /opt/oracle/

# Add to library path
echo /opt/oracle/instantclient_21_12 | sudo tee /etc/ld.so.conf.d/oracle-instantclient.conf
sudo ldconfig
```

## Step 6: Install Node.js Dependencies

```bash
cd server
npm install
```

## Step 7: Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on: http://localhost:5000

## Step 8: Test the API

Test health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "CareerLens API is running with Oracle Database"
}
```

## SQL*Plus Useful Commands

### Check if tables exist:
```sql
SELECT table_name FROM user_tables WHERE table_name IN ('USERS', 'RESUME_ANALYSES');
```

### View table structure:
```sql
DESC users;
DESC resume_analyses;
```

### View all users:
```sql
SELECT id, name, email, created_at FROM users;
```

### View analysis history:
```sql
SELECT id, user_id, role_title, ats_score, created_at FROM resume_analyses;
```

### Delete all data (for testing):
```sql
DELETE FROM resume_analyses;
DELETE FROM users;
COMMIT;
```

### Drop tables (if you need to recreate):
```sql
DROP TABLE resume_analyses;
DROP TABLE users;
```

## Troubleshooting

### Error: ORA-12154: TNS:could not resolve the connect identifier
- Check your connection string in `.env`
- Verify Oracle listener is running: `lsnrctl status`

### Error: DPI-1047: Cannot locate a 64-bit Oracle Client library
- Install Oracle Instant Client
- Add Instant Client directory to PATH

### Error: ORA-01017: invalid username/password
- Verify credentials in `.env` file
- Try connecting with SQL*Plus first to confirm credentials

### Error: Cannot find module 'oracledb'
- Run `npm install` in server directory
- Ensure Oracle Instant Client is installed

### Connection pool error:
- Check if Oracle Database is running
- Verify port 1521 is not blocked by firewall
- Test connection with SQL*Plus first

## Database Schema

### USERS Table
```sql
ID          NUMBER (Primary Key, Auto-increment)
NAME        VARCHAR2(255)
EMAIL       VARCHAR2(255) UNIQUE
PASSWORD    VARCHAR2(255) (Hashed with bcrypt)
CREATED_AT  TIMESTAMP
UPDATED_AT  TIMESTAMP
```

### RESUME_ANALYSES Table
```sql
ID              NUMBER (Primary Key, Auto-increment)
USER_ID         NUMBER (Foreign Key → users.id)
ROLE_ID         VARCHAR2(100)
ROLE_TITLE      VARCHAR2(255)
ATS_SCORE       NUMBER
MATCHED_SKILLS  CLOB (JSON)
MISSING_SKILLS  CLOB (JSON)
SUGGESTIONS     CLOB (JSON)
CREATED_AT      TIMESTAMP
```

## Security Notes

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Use strong JWT_SECRET in production
- Never commit `.env` file to version control
- Use prepared statements to prevent SQL injection

## Production Deployment

For production:
1. Use a dedicated Oracle user (not SYSTEM)
2. Set strong passwords
3. Enable SSL/TLS for database connections
4. Use environment-specific `.env` files
5. Set up proper backup strategy
6. Monitor connection pool usage
