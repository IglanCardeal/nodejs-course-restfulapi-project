import jwt from "jsonwebtoken";

// *******************> colocar private key nas variaveis de ambiente
const PRIVATE_KEY = `MIGsAgEAAiEAq6IuOMeSqjKIXpyrT//MQjmvEBgAqlb/rwY3ECtu/GECAwEAAQIh
AJA8G8HlnZBgJQ/1c1Yoblq6L2aYU9QPft/EEAzu8X7NAhEA7PJZP/KQ+WJXT6yk
FLd2/wIRALlvVPfKgyl52jPUT2U37J8CEDW9gaCPU3I8a7EWZuCL++ECEQCLjV6r
kMt+5kYxpUEPErRPAhEA0jzBA675ZLARAgK54Ec2XA==`;

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
    const token = req.get("Authorization").split(" ")[1]; // extrai somente o token.
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
