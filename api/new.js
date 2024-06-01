import {
    hasValidAPIKey,
    hasValidHeader,
    hasValidNewRecordFields,
} from '../services/validation.js';
import { createRecord } from '../services/database.js';
import { send } from '../services/email.js';
import { aadFooterToHTML, addUUIDToText } from '../utils/general.js';
import { allowCors } from '../utils/cors.js';

async function handler(req, res) {
    try {
        hasValidAPIKey(req);
        hasValidHeader(req);
        const requestObject = JSON.parse(req.body);
        hasValidNewRecordFields(requestObject);
        const newRecord = await createRecord(
            requestObject[process.env.CLIENT_ONE_COLUMN],
            requestObject[process.env.CLIENT_TWO_COLUMN],
        );

        if (requestObject.text) {
            requestObject.text = addUUIDToText(
                requestObject.text,
                newRecord[0]?.id,
            );
        }

        if (requestObject.textAsHtml) {
            requestObject.textAsHtml = aadFooterToHTML(
                requestObject.textAsHtml,
                newRecord[0]?.id,
            );
        }

        await send(requestObject, newRecord);

        return res.status(200).json({ id: newRecord[0]?.id });
    } catch (e) {
        if (!e.code) e.code = 500;

        return res.status(e.code).json({ message: e.message });
    }
}

export default allowCors(handler)
