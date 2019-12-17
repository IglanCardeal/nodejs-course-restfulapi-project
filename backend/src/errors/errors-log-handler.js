import winston from 'winston';
import fs from 'fs';

const { format, transports } = winston;

// Tratamento para gerar arquivos de logs de erros nao tratados.
export default (error, filepath) => {
  const logConfiguration = {
    format: format.combine(format.simple()),
    transports: [
      new transports.Console({
        format: format.combine(format.colorize({ all: true }), format.simple()),
      }),
      new transports.Stream({
        stream: fs.createWriteStream(filepath, { flags: 'a' }),
      }),
    ],
  };

  const logger = winston.createLogger(logConfiguration);

  logger.info(
    '\n================================= BEGIN =============================================',
  );
  logger.info(`Date: ${new Date()}`);
  logger.error('message: ', error, '\n');
  logger.info(
    '\n================================== END ==============================================\n',
  );
};
