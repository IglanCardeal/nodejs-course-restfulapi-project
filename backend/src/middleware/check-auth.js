import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.API_PRIVATE_KEY;

export default (req, res, next) => {
  /*
    Formato do header Authorization
    'Bearer [chave do token]'
  */
  try {
    const checkAuthHeader = req.get('Authorization');

    if (!checkAuthHeader) {
      const error = new Error('Not authenticated! Make login first.');
      error.statusCode = 401;
      error.doNotGenerateLog = true;

      throw error;
    }

    const token = checkAuthHeader.split(' ')[1]; // extrai somente o token.

    let decodedToken;

    jwt.verify(token, PRIVATE_KEY, (error, decoded) => {
      if (error) {
        const err = new Error('Invalid token! Try to login again.');
        err.statusCode = 401;
        err.doNotGenerateLog = true;

        throw err;
      }

      decodedToken = decoded;
    });

    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    next(error);
  }
};
