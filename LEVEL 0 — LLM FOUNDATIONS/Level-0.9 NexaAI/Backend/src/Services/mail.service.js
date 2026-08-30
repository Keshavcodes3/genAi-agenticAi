import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
    if (!transporter) {
        const requiredEnvVars = ["EMAIL_USER", "CLIENT_ID", "CLIENT_SECRET", "REFRESH_TOKEN"];
        const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

        if (missingEnvVars.length > 0) {
            throw new Error(`Missing email environment variables: ${missingEnvVars.join(", ")}`);
        }

        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
            },
        });
    }
    return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
    const mailTransporter = getTransporter();

    const info = await mailTransporter.sendMail({
        from: `"Nexa AI" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });

    return info;
};
