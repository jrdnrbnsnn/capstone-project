const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { client, createTables, getAllUsers, login, register } = require("./db");
const app = express();

app.use(express.json());
app.use(cors());

// LOGIN ROUTE
app.post("/api/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await login(username, password);
    delete user.password;
    const token = jwt.sign(user, "secret");
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
});

// REGISTER ROUTE
app.post("/api/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await register(username, password);
    delete user.password;
    const token = jwt.sign(user, "secret");
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
});

function requireToken(req, res, next) {
  const token = req.headers.authorization;
  try {
    const user = jwt.verify(token, "secret");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// GET ALL USERS ROUTE - PROTECTED
app.get("/api/users", requireToken, async (req, res, next) => {
  const users = await getAllUsers();
  res.send(users.rows);
});

async function init() {
  client.connect();
  createTables();

  app.listen(3000, () => {
    console.log("The server is listening on port 3000!");
  });
}

init();
