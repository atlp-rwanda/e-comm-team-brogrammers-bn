import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.TOKEN_SECRET

function isAuthenticated(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.json({ message: "please login"})

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.res.json({ message: "this token is  forbidden"});
    req.user = user;
    next();
  });
}
export default isAuthenticated