
import nodemailer from 'nodemailer';

export default nodemailer.createTransport({
    host: process.env.MAILER_SMTP_HOST,
    port: Number(process.env.MAILER_SMTP_PORT) || 25,
    auth: {
        user: process.env.MAILER_SMTP_USERNAME,
        pass: process.env.MAILER_SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production", // fail on invalid certs only on production
    },
    debug: true,
})