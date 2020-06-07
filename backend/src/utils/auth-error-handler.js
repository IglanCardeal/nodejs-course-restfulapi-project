export default (message, statusCode) => {
  let error;

  if (typeof message !== 'string' || typeof statusCode !== 'number') {
    error = new Error(
      `Server error! Type of message or type of status code is an invalid type!\n
      Check "authErrorController" function on auth.js controller.`,
    );
    error.statusCode = 500;

    throw error;
  }

  error = new Error(message);
  error.statusCode = statusCode;
  error.doNotGenerateLog = true;

  throw error;
};
