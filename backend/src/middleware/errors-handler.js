import { join } from 'path';
import generateErrorsLog from '../errors/errors-log-handler';

// eslint-disable-next-line no-unused-vars
export default (error, req, res, next) => {
  // tratamento geral de erros, executa sempre que tiver um next(error).
  const filepath = join(__dirname, '../logs/errors.log');
  const status = error.statusCode || 500;

  const message = error.statusCode
    ? error.message
    : 'Internal Server Error! We are working to solve that, sorry. :(';

  res.status(status).json({ message });

  const shouldGenerateLogErrors = !error.doNotGenerateLog;

  if (shouldGenerateLogErrors) generateErrorsLog(error, filepath);
};
