import mongoose from "mongoose";
import { MONGODB_LOCAL, MONGODB_URI, NODE_ENV } from "./env.config.js";

const connectDB = async() => {
  try {
    const mongodbUri = NODE_ENV === 'production' ?  MONGODB_URI : MONGODB_LOCAL;
    await mongoose.connect(mongodbUri);
    console.log('Base de datos Conectada');
  } catch (error) {
    console.log('Error al intentar conectar con la base de datos');
    console.log("❌ Error al conectar a MongoDB Atlas:", error.message);
  }
}

export default connectDB;