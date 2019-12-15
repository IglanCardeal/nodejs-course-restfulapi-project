import databaseConnection from "./config/database-connection";

import app from "./src/app";

const PORT = process.env.APP_SERVER_PORT || 8080;

databaseConnection(() => {
  const server = app.listen(PORT);

  require("./src/middleware/socket").init(server);

  console.log("Server running on port:", PORT);
  console.info("Enviroment: " + process.env.NODE_ENV);
});
