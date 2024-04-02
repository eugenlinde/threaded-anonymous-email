import dotenv from "dotenv";
dotenv.config();
import mail from "@sendgrid/mail";

export const send = async (data, record) => {
    const clientOne = record[0]?.[process.env.CLIENT_ONE_TABLE];
    const clientTwo = record[0]?.[process.env.CLIENT_TWO_TABLE];

    switch (data.from) {
        case (clientOne.email):
            await handleSendgrid({ to: clientTwo.email, ...data });
            break;
        case (clientTwo.email):
            await handleSendgrid({ to: clientOne.email, ...data });
            break;
        default:
            console.error('No matching emails: ', { from: data.from, threadRef: data.threadRef });
            const noMatchError = new Error('Failed to find matching records')
            noMatchError.code = 404;
            throw noMatchError;
    }
}

const handleSendgrid = async (data) => {
    if (!process.env.SENDGRID_API_KEY || !process.env.FROM_ADDRESS) {
        throw new Error('Missing email service variables!');
    }

    mail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        from: process.env.FROM_ADDRESS,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.textAsHtml };

    try {
        return await mail.send(msg);
    } catch (error) {
        console.error('failed to send email: ', error);

        if (error.response) {
            console.error('error response body: ', error.response.body)
        }

        throw new Error('Failed to send email!');
    }
}
