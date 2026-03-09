-- Connect to SQL*Plus as SYSTEM or SYSDBA
-- sqlplus system/password@localhost:1521/XEPDB1

-- Create users table
CREATE TABLE users (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR2(255) NOT NULL,
  email VARCHAR2(255) UNIQUE NOT NULL,
  password VARCHAR2(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Create resume_analyses table (optional - to store analysis history)
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

-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_id ON resume_analyses(user_id);

-- Verify tables created
SELECT table_name FROM user_tables WHERE table_name IN ('USERS', 'RESUME_ANALYSES');

-- Sample query to check structure
DESC users;
DESC resume_analyses;
