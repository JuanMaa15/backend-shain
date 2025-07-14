import app from "#app.js";
import { PORT } from "#config/env.config.js";
import connectDB from "#config/db.config.js";

connectDB();

app.listen( PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});