import jwt from "jsonwebtoken";
import { sendEmail } from "../Services/mail.service.js";

const getBackendUrl = () =>
    (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

export const createEmailVerificationToken = (userId) =>
    jwt.sign({ id: userId, purpose: "email_verification" }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const getVerificationUrl = (token) =>
    `${getBackendUrl()}/api/auth/verify-email/${token}`;

const sendEmailVerificationEmail = async ({ email, username, userId }) => {
    const token = createEmailVerificationToken(userId);
    const verificationUrl = getVerificationUrl(token);

    await sendEmail({
        to: email,
        subject: "Verify your Nexa AI account",
        text: `Hi ${username},\n\nPlease verify your email by opening this link:\n${verificationUrl}\n\nThis link expires in 7 days.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
                <h2>Welcome to Nexa AI, ${username}!</h2>
                <p>Thanks for registering with <strong>${email}</strong>.</p>
                <p>Click the button below to verify your email address:</p>
                <a href="${verificationUrl}"
                   style="display: inline-block; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">
                    Verify Email
                </a>
                <p style="margin-top: 24px; color: #666; font-size: 14px;">
                    Or copy this link into your browser:<br />
                    <a href="${verificationUrl}">${verificationUrl}</a>
                </p>
                <p style="color: #666; font-size: 14px;">This link expires in 7 days.</p>
            </div>
        `,
    });

    return token;
};

export default sendEmailVerificationEmail;
