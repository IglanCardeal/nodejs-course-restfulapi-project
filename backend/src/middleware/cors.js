module.exports = (_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // permite request de todas as origens.
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, DELETE, PUT, PATCH' // metodos de request aceitos.
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // headers de request aceitos.

  return next();
};
