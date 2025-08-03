import mongoose from "mongoose";
import crypto from "node:crypto";

export const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));


export const createSecureToken = () => crypto.randomBytes(32).toString('hex');