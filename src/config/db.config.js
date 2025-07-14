import mongoose from "mongoose";

const connectDB = async() => {
  try {
    await mongoose.connect('mongodb://localhost/shain');
    console.log('Base de datos Conectada');
  } catch (error) {
    console.log('Error al intentar conectar con la base de datos');
  }
}

export default connectDB;