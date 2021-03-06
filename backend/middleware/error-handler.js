import generateErrorsLog from "../errors/errors-log-handler";
import { join } from "path";

export default (error, req, res, next) => {
  // tratamento geral de erros, executa sempre que tiver um next(error).
  const filepath = join(__dirname, "../logs/errors.log");
  const status = error.statusCode || 500;
  const message = error.statusCode
    ? error.message
    : "Internal Server Error! We are working to solve that, sorry. :(";
  res.status(status).json({ message });
  generateErrorsLog(error, filepath);
};
