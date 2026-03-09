# CareerLens Backend Server

Backend API for CareerLens with MySQL database integration.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- MySQL Workbench or command line access

## Setup Instructions

### 1. Install MySQL

If you don't have MySQL installed:
- Download from: https://dev.mysql.com/downloads/mysql/
- Or use XAMPP/WAMP which includes MySQL

### 2. Create Database

Open MySQL Workbench or command line and run:

```bash
mysql -u root -p
```

Then execute the SQL file:

```sql
source database.sql
```

Or manually run the commands in `database.sql`

### 3. Configure Environment

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=careerlens
JWT_SECRET=your_secret_key_here_change_this
```

### 4. Install Dependencies

```bash
cd server
npm install
```

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on: http://localhost:5000

### 6. Update Frontend

The frontend is already configured to use the backend API at `http://localhost:5000/api`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/verify` - Verify JWT token
  - Headers: `Authorization: Bearer <token>`

### Analysis (Protected Routes)

- `POST /api/analysis/save` - Save analysis result
- `GET /api/analysis/history` - Get user's analysis history
- `GET /api/analysis/:id` - Get specific analysis details

## Database Schema

### users table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### resume_analyses table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (INT, FOREIGN KEY)
- role_id (VARCHAR)
- role_title (VARCHAR)
- ats_score (INT)
- matched_skills (JSON)
- missing_skills (JSON)
- suggestions (JSON)
- created_at (TIMESTAMP)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- SQL injection prevention with parameterized queries
- CORS enabled for frontend

## Testing

Test the API health:
```bash
curl http://localhost:5000/api/health
```

## Troubleshooting

**MySQL Connection Error:**
- Check if MySQL server is running
- Verify credentials in `.env` file
- Ensure database `careerlens` exists

**Port Already in Use:**
- Change PORT in `.env` file
- Update API_URL in frontend `src/contexts/AuthContext.tsx`

**CORS Error:**
- Ensure backend server is running
- Check if frontend is making requests to correct URL
