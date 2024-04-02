import multiparty from "multiparty";
import { simpleParser } from "mailparser";
import { findUUIDs } from "../utils/general.js";

export const parse = async (req) => {
    const form = new multiparty.Form();

    try {
        const data = await new Promise((resolve, reject) => {
            form.parse(req, function (err, fields, files) {
                if (err) reject({err});
                resolve({ fields, files });
            });
        });

        if (Array.isArray(data.fields.email) && data.fields.email[0]) {
            const parsed = await simpleParser(data.fields.email[0]);

            return {
                from: parsed.from.value[0]?.address,
                subject: parsed.subject,
                html: parsed.html,
                text: parsed.text,
                textAsHtml: parsed.textAsHtml,
                threadRef: findUUIDs(parsed.text)
            };
        } else {
            console.error('Email body is not parsed', data);
        }
    } catch (e) {
        console.error("error: ", e);
        throw e;
    }

    throw new Error('Unable to read email body.');
}