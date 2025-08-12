# Citizen Engagement hub Backend

This is the backend implementation for the **Citizen Engagement Hub**.  
It provides REST API endpoints for:
- User registration & login
- Reporting, viewing, updating, and deleting issues
- Viewing and voting in polls
- Viewing notifications

The API is documented with Swagger and can be tested interactively.

---

## 📦 Installation

1. **Clone the repository** from GitHub:
   ```bash
   git clone https://github.com/rheaaclaire/DigitalCitizenEngagementHub-TechTorch.git
   ```
2. **Go to the backend folder**:
   ```bash
   cd backend
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

---

## ▶️ Running the Backend

Start the server:
```bash
node server.js
```

The server will run at:
- API base URL: **http://localhost:3000**
- Swagger API docs: **http://localhost:3000/api-docs**

---

## 🔑 Authentication

Some endpoints require login and use **JWT tokens**.

1. **Register** a user via:
   ```
   POST /users/register
   ```
2. **Login** via:
   ```
   POST /users/login
   ```
   This will return a `token`.
3. In **Swagger UI**, click **Authorize** and paste:
   ```
   Bearer YOUR_TOKEN_HERE
   ```

---

## 🛠 Testing the API

Example flow to test:

1. **Register** → `/users/register`
2. **Login** → `/users/login` (get token)
3. **Create Issue** → `/issues` (requires token)
4. **Get All Issues** → `/issues`
5. **Get Single Issue** → `/issues/{id}`
6. **Update Issue** → `/issues/{id}` (requires token)
7. **Delete Issue** → `/issues/{id}` (requires token)
8. **Get Polls** → `/polls`
9. **Vote in Poll** → `/polls/{pollId}/vote`
10. **Get Notifications** → `/notifications`

---

## 📄 Notes

- Data is stored in memory (arrays). Restarting the server clears all data.
- JWT secret is stored in code for demo purposes.  
  For production, store secrets in environment variables.
- Swagger documentation is automatically generated from `swagger.yaml`.

---

## 📜 License

This project is for academic use as part of the assignment requirements.
