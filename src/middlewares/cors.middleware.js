export const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Manejar preflight (OPTIONS)
  if (req.method === 'OPTIONS')  return res.sendStatus(204);

  return next();
    
}