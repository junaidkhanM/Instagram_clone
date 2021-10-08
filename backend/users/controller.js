const pool = require('../db');
const queries = require('./queries');
const bcrypt = require('bcrypt');
const jwtGenerator = require('./utils/jwtGenerator');

const createTable = async () => {
  try {
    await pool.query(queries.createTable);
  } catch (error) {
    throw new Error(error);
  }
};

createTable();

const getUser = async (request, response, next) => {
  try {
    let userData = await pool.query(queries.getUser);
    response.status(200).json(userData.rows);
    next();
  } catch (error) {
    throw new Error(error);
  }
};

const addUser = async (request, response) => {
  const { firstName, lastName, email, password } = request.body;
  try {
    //check if email or user already exists..
    let userExists = await pool.query(queries.checkEmailExists, [email]);
    if (userExists.rows.length) {
      return response.send(false);
    } else {
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
      let newUser = await pool.query(queries.addUser, [
        firstName,
        lastName,
        email,
        bcryptPassword,
      ]);

      const jwtToken = jwtGenerator(newUser.rows[0].user_email);

      return response.json({ jwtToken });
    }
  } catch (error) {
    throw new Error(error);
  }
};

const loginUser = async (request, response) => {
  const { email, password } = request.body;

  try {
    const userExists = await pool.query(queries.loginUserData, [email]);
    let loginUserData = userExists.rows[0];

    if (loginUserData && loginUserData.user_email === email) {
      // const validPassword = await bcrypt.compare(
      //   password,
      //   userExists.user_password
      // );

      // console.log(validPassword);

      // if (!validPassword) {
      //   return res.status(401).json('Invalid Credential');
      // }

      const jwtToken = jwtGenerator(loginUserData.user_email);

      return response.json({ jwtToken });
    } else {
      return response.send(false);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const homeUser = async (request, response, next) => {
  try {
    let userData = await pool.query(queries.getUser);
    return response.status(200).json(userData.rows);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { getUser, addUser, loginUser, homeUser };
