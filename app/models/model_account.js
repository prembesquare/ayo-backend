const client = require("../db");
const bcrypt = require("bcrypt");

async function createUser({ name, email, password }) {
  const query =
    "INSERT INTO ayo_drc_schema.tableuser (name, email, password) VALUES ($1, $2, $3) RETURNING *";
  const hashedPassword = await hashPassword(password);
  const values = [name, email, hashedPassword];

  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

async function hashPassword(password) {
  if (!password) {
    throw new Error("Invalid password");
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function findUserByEmail(email) {
  try {
    const query = "SELECT * FROM ayo_drc_schema.tableuser WHERE email = $1";
    const resp = await client.query(query, [email]);
    return resp.rows[0];
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

module.exports = { createUser, findUserByEmail, hashPassword };
