# API_CONTRACT.md

## 1. Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js + Express.js



----

## 2. Core Features
1. **User Registration & Login**  
   Citizens, government employees, and organizations can create accounts and log in.
2. **Submit Feedback / Report Issues**  
   Users can report problems like potholes, broken streetlights, garbage issues, etc.
3. **Participate in Polls / Public Consultations**  
   Users can vote or provide opinions on city-related matters.
4. **Track Submission Status**  
   Users can view the progress of their reported issues.
5. **Receive Notifications & Announcements**  
   Government can send updates, events, or emergency alerts to the public.

----

## 3. Data Models

### User
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "citizen" // or "gov_employee", "organization"
}
```

### IssueReport
```json
{
  "id": 101,
  "title": "Pothole near market",
  "description": "Large pothole on Main Street",
  "category": "Road",
  "status": "pending", // pending, in_progress, resolved
  "created_by": 1,
  "created_at": "2025-08-10T12:00:00Z"
}
```

### Poll
```json
{
  "id": 201,
  "question": "Should we add more streetlights?",
  "options": [
    { "id": 1, "text": "Yes" },
    { "id": 2, "text": "No" }
  ],
  "status": "active" // active, closed
}
```

### Notification
```json
{
  "id": 301,
  "title": "Water Supply Interruption",
  "message": "Water will be unavailable from 2 PM to 5 PM",
  "date": "2025-08-11"
}
```

---

## 4. API Endpoints

### 1. User Registration
- **Feature:** Create a new user account  
- **HTTP Method:** `POST`  
- **Endpoint:** `/api/users/register`  
- **Description:** Registers a new citizen or government employee.  
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "citizen"
}
```
- **Success Response (200 OK):**
```json
{
  "message": "User registered successfully",
  "user_id": 1
}
```
- **Error Response (400 Bad Request):**
```json
{
  "error": "Email already exists"
}
```

---

### 2. Login
- **Feature:** Authenticate user and return token  
- **HTTP Method:** `POST`  
- **Endpoint:** `/api/users/login`  
- **Description:** Logs in a user and returns authentication token.  
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
- **Success Response (200 OK):**
```json
{
  "token": "jwt_token_here"
}
```
- **Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 3. Submit Issue Report
- **Feature:** Citizens report problems like potholes  
- **HTTP Method:** `POST`  
- **Endpoint:** `/api/issues`  
- **Description:** Create a new issue report.  
- **Request Body:**
```json
{
  "title": "Broken Streetlight",
  "description": "Light not working near park",
  "category": "Lighting"
}
```
- **Success Response (201 Created):**
```json
{
  "message": "Issue reported successfully",
  "issue_id": 101
}
```
- **Error Response (400 Bad Request):**
```json
{
  "error": "Title is required"
}
```

---

### 4. Get All Issues
- **Feature:** View list of all reported issues  
- **HTTP Method:** `GET`  
- **Endpoint:** `/api/issues`  
- **Description:** Returns all issue reports.  
- **Success Response (200 OK):**
```json
[
  {
    "id": 101,
    "title": "Pothole near market",
    "status": "pending"
  }
]
```

---

### 5. Vote in Poll
- **Feature:** Citizens participate in polls  
- **HTTP Method:** `POST`  
- **Endpoint:** `/api/polls/:pollId/vote`  
- **Description:** Casts a vote in a poll.  
- **Request Body:**
```json
{
  "option_id": 1
}
```
- **Success Response (200 OK):**
```json
{
  "message": "Vote recorded"
}
```
- **Error Response (404 Not Found):**
```json
{
  "error": "Poll not found"
}
```

---

### 6. Get Notifications
- **Feature:** View government updates  
- **HTTP Method:** `GET`  
- **Endpoint:** `/api/notifications`  
- **Description:** Returns all public notifications.  
- **Success Response (200 OK):**
```json
[
  {
    "id": 301,
    "title": "Water Supply Interruption",
    "message": "Water will be unavailable from 2 PM to 5 PM"
  }
]
```
