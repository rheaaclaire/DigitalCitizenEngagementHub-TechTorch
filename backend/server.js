const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// ====== Temporary in-memory "database" ======
let users = [];
let issues = [];
let polls = [
  {
    id: 1,
    question: "Should we build a new park?",
    options: [
      { id: 1, text: "Yes", votes: 0 },
      { id: 2, text: "No", votes: 0 }
    ],
    status: "active"
  }
];
let notifications = [
  { id: 1, title: "Water Supply Interruption", message: "Water will be unavailable from 2 PM to 5 PM", date: "2025-08-12" }
];

let userIdCounter = 1;
let issueIdCounter = 1;

// Secret key for JWT
const SECRET = "supersecret";

// ====== Middleware for auth ======
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token provided" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ====== USER ROUTES ======

// Register
app.post('/users/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields required" });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const hashed = bcrypt.hashSync(password, 10);
  const user = { id: userIdCounter++, name, email, password: hashed, role };
  users.push(user);
  res.json({ message: "Registered successfully", userId: user.id });
});

// Login
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "6h" });
  res.json({ token });
});

// ====== ISSUE ROUTES ======

// Create issue (requires login)
app.post('/issues', auth, (req, res) => {
  const { title, description, category } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });
  const issue = {
    id: issueIdCounter++,
    title,
    description: description || '',
    category: category || 'General',
    status: 'pending',
    created_by: req.user.id,
    created_at: new Date().toISOString()
  };
  issues.push(issue);
  res.status(201).json(issue);
});

// Get all issues
app.get('/issues', (req, res) => {
  res.json(issues.map(i => ({ id: i.id, title: i.title, status: i.status })));
});

// Get single issue
app.get('/issues/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const issue = issues.find(i => i.id === id);
  if (!issue) return res.status(404).json({ error: "Not found" });
  res.json(issue);
});

// Update issue (requires login)
app.put('/issues/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const issue = issues.find(i => i.id === id);
  if (!issue) return res.status(404).json({ error: "Not found" });
  if (req.user.role !== 'gov_employee' && req.user.id !== issue.created_by) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { title, description, category, status } = req.body;
  if (title) issue.title = title;
  if (description) issue.description = description;
  if (category) issue.category = category;
  if (status) issue.status = status;
  res.json(issue);
});

// Delete issue (requires login)
app.delete('/issues/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  if (req.user.role !== 'gov_employee' && req.user.id !== issues[index].created_by) {
    return res.status(403).json({ error: "Forbidden" });
  }
  issues.splice(index, 1);
  res.json({ message: "Deleted" });
});

// ====== POLLS ======

// Get polls
app.get('/polls', (req, res) => {
  res.json(polls);
});

// Vote in poll
app.post('/polls/:pollId/vote', (req, res) => {
  const pollId = parseInt(req.params.pollId);
  const { option_id } = req.body;
  const poll = polls.find(p => p.id === pollId);
  if (!poll) return res.status(404).json({ error: "Poll not found" });
  const option = poll.options.find(o => o.id === option_id);
  if (!option) return res.status(404).json({ error: "Option not found" });
  option.votes++;
  res.json({ message: "Vote recorded" });
});

// ====== NOTIFICATIONS ======
app.get('/notifications', (req, res) => {
  res.json(notifications);
});

// ====== TEST ROUTE ======
app.get('/hello', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// ====== Swagger setup ======
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ====== Start server ======
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Docs at http://localhost:3000/api-docs");
});
