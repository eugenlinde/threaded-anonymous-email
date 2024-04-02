import { parse } from "../services/parsing.js";
import { hasValidReplyFields, hasValidHeader } from "../services/validation.js";
import { getRecord } from "../services/database.js";
import { send } from "../services/email.js";

export default async function handler(req, res) {
    try {
        hasValidHeader(req);
        const parsed = await parse(req);
        hasValidReplyFields(parsed);
        const record = await getRecord(parsed);
        await send(parsed, record);
        return res.status(200).json({ message: 'OK' });
    } catch (e) {
        if (!e.code) e.code = 500;
        return res.status(e.code).json({ message: e.message });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};