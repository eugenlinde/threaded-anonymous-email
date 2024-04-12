import dotenv from 'dotenv';
dotenv.config();
import nodemailer from "nodemailer";

export const send = async (data, record) => {
    const clientOne = record[0]?.[process.env.CLIENT_ONE_TABLE];
    const clientTwo = record[0]?.[process.env.CLIENT_TWO_TABLE];

    switch (data.from) {
        case clientOne.email:
            await handleNodeMailer({ to: clientTwo.email, ...data });
            break;
        case clientTwo.email:
            await handleNodeMailer({ to: clientOne.email, ...data });
            break;
        default:
            console.error('No matching emails: ', {
                from: data.from,
                threadRef: data.threadRef,
            });
            const noMatchError = new Error('Failed to find matching records');
            noMatchError.code = 404;
            throw noMatchError;
    }
};

const handleNodeMailer = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        return await transporter.sendMail({
            from: process.env.FROM_ADDRESS,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.textAsHtml,
        });
    } catch (error) {
        console.error('failed to send email: ', error);

        if (error.response) {
            console.error('error response body: ', error.response.body);
        }

        throw new Error('Failed to send email!');
    }
}
