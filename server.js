import app from "#app.js";
import { PORT } from "#config/env.config.js";
import connectDB from "#config/db.config.js";

connectDB();

app.listen( PORT || 3000, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});