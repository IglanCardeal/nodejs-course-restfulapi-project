import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.API_PRIVATE_KEY;

export default (req, res, next) => {
  /*
    Formato do header Authorization
    'Bearer [chave do token]'
  */
  try {
    const checkAuthHeader = req.get("Authorization");
    if (!checkAuthHeader) {
      const error = new Error("Not authenticated! Make login first.");
      error.statusCode = 401;
      throw error;
    }
    const token = checkAuthHeader.split(" ")[1]; // extrai somente o token.
    let decodedToken;
    jwt.verify(token, PRIVATE_KEY, (error, decoded) => {
      if (error) {
        const error = new Error("Invalid token! Try to login again.");
        error.statusCode = 401;
        throw error;
      }
      decodedToken = decoded;
    });
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};
