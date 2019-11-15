const router = require('express').Router();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersDB = require("../users/user-model");


router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // We shouldn't store a user if they have a missing username or password
  if (!username || !password) {
    res.status(500).json({ error: 'Invalid credentials for creating user' })
  } else {
    const hash = bcrypt.hashSync(password, 8);

    usersDB.add({ username, password: hash })
      .then(user => {
        res.status(200).json(user);
      })
      .catch(error => {
        res.status(500).json({ error: 'There was a registration error.' })
      })
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;

  // We can't login a user if they have a missing username or password
  if (!username || !password) {
    res.status(500).json({ error: 'There was an error signing the user into the database.' })
  } else {

    usersDB.findByUserName({ username })
      .then(user => {
        //making sure the passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome ${user.username}!`,
            user: {
              id: user.id,
              username: user.username,
              password: user.password
            },
            token,
          });
        } else {
          res.status(401).json({ message: 'Invalid Credentials!' });
        }
      })
      .catch(error => {
        res.status(500).json({ error: 'There was an error signing the user into the database.' });
      })
  }
});


function generateToken(user) {
  const payload = {
    username: user.username,
    id: user.id,
  };

  const secret = process.env.JWT_SECRET || "is it secret, is it safe?"

  const options = {
    expiresIn: "1h"
  };
  return jwt.sign(payload, secret, options);
}

module.exports = router;