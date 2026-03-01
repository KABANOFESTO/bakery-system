"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
        throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.');
    }
    return nodemailer_1.default.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });
};
exports.emailService = {
    sendUserCredentialsEmail: async (payload) => {
        const from = process.env.MAIL_FROM || process.env.SMTP_USER;
        if (!from) {
            throw new Error('MAIL_FROM or SMTP_USER must be configured.');
        }
        const transporter = getTransporter();
        await transporter.sendMail({
            from,
            to: payload.to,
            subject: 'Your Bakery Management Account Credentials',
            text: `Your account has been created.\n\nEmail: ${payload.to}\nTemporary Password: ${payload.temporaryPassword}\n\nPlease log in and change your password immediately.`,
            html: `
        <p>Your account has been created.</p>
        <p><strong>Email:</strong> ${payload.to}</p>
        <p><strong>Temporary Password:</strong> ${payload.temporaryPassword}</p>
        <p>Please log in and change your password immediately.</p>
      `,
        });
    },
};
//# sourceMappingURL=emailService.js.map