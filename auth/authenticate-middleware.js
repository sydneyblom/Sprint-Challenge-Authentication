/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (typeof token !== 'undefined' && token) {
    const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

    // check that the token is valid
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid Credentials" });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ message: "No credentials provided" });
  }
};