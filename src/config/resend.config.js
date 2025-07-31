import { Resend } from "resend";
import { RESEND_API_KEY } from "./env.config.js";

export const resend = new Resend(RESEND_API_KEY);