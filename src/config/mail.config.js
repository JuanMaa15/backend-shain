import { Resend } from "resend";
import { EMAIL_HOST, EMAIL_PASS, EMAIL_PORT, EMAIL_USER, RESEND_API_KEY } from "./env.config.js";
import nodemailer from "nodemailer";

export const resend = new Resend(RESEND_API_KEY);

export const transportNodemailer = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: parseInt(EMAIL_PORT, 10),
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

