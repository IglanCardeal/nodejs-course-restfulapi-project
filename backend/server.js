import dotenv from 'dotenv';
import databaseConnection from './config/database-connection';
import app from './src/app';

dotenv.config();

const PORT = process.env.APP_SERVER_PORT || 8080;

databaseConnection(() => {
  const server = app.listen(PORT);

  require('./src/middleware/socket').init(server);

  console.info('Server running on port:', PORT);
  console.info(`Enviroment: ${process.env.NODE_ENV}`);
});
