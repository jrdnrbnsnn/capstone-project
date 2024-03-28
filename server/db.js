const pg = require("pg");
const bcyrpt = require("bcrypt");
const uuid = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/reachromeo"
);

// Register
async function register(username, password) {
  const SQL = `
    INSERT INTO users(user_id, username, password)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  const hash = await bcyrpt.hash(password, 10);
  const { rows } = await client.query(SQL, [uuid.v4(), username, hash]);
  const user = rows[0];
  return user;
}

// LOGIN
async function login(username, password) {
  const SQL = `
    SELECT * FROM users
    WHERE username = $1;
    `;
  const { rows } = await client.query(SQL, [username]);
  const user = rows[0];
  if (!user) {
    throw new Error("User not found");
  }
  const match = await bcyrpt.compare(password, user.password);
  return user;
}

async function getAllUsers() {
  const SQL = `
    SELECT user_id, username FROM users;
    `;

  return client.query(SQL);
}

async function createTables() {
  const SQL = `
  DROP TABLE IF EXISTS users;
  CREATE TABLE users(
    user_id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `;
  await client.query(SQL);
}

module.exports = {
  client,
  createTables,
  getAllUsers,
  login,
  register,
};
