import mongoose from "mongoose";
import { MONGODB_URI } from "./env.config.js";

const connectDB = async() => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Base de datos Conectada');
  } catch (error) {
    console.log('Error al intentar conectar con la base de datos');
    console.error("❌ Error al conectar a MongoDB Atlas:", error.message);
  }
}

export default connectDB;