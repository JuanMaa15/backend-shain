import mongoose from "mongoose";


export const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));


export const createSecureToken = () => crypto.randomBytes(32).toString('hex');