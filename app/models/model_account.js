const client = require("../db");
const bcrypt = require("bcrypt");
const CustomError = require('../middleware/CustomError');

async function createUser({ name, email, password }) {
  const query =
    "INSERT INTO ayo_drc_schema.tableuser (name, email, password) VALUES ($1, $2, $3) RETURNING *";
  const hashedPassword = await hashPassword(password);
  const values = [name, email, hashedPassword];

  try {
    const result = await client.query(query, values);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error(error);
    throw new CustomError(500, "Failed to create user");
  }
}

async function hashPassword(password) {
  if (!password) {
    throw new CustomError(400, "Invalid password");
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function updateUserPassword(userId, newPassword) {
  const query = "UPDATE ayo_drc_schema.tableuser SET password = $1 WHERE id = $2";
  const values = [newPassword, userId];

  try {
    await client.query(query, values);
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new CustomError(500, "Failed to update user password");
  }
}

async function findUserByEmail(email) {
  try {
    const query = "SELECT * FROM ayo_drc_schema.tableuser WHERE email = $1";
    const resp = await client.query(query, [email]);
    if (resp.rows.length === 0) {
      return { success: false, message: "User not found" };
    }
    return { success: true, data: resp.rows[0] };
  } catch (e) {
    console.error(e);
    throw new CustomError(500, "Failed to find user");
  }
}

module.exports = { createUser, findUserByEmail, hashPassword, updateUserPassword };