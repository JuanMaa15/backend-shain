export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (error) {
    const formattedErrors = Object.fromEntries(      
      error.issues.map( error => {
        const [fieldName] = error.path;    
        return [fieldName, error.message] 
      })
    );

    return res.status(400).json(formattedErrors);
    
  }
}