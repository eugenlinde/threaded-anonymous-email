import validationError from '../errors/validationError.js';
import dotenv from 'dotenv';
dotenv.config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const hasValidReplyFields = (req) => {
    if (
        !req.from ||
        !emailRegex.test(req.from) ||
        !req.threadRef ||
        !req.subject ||
        !req.textAsHtml
    ) {
        throw new validationError('Missing fields');
    }
};

export const hasValidHeader = (req) => {
    const { headers } = req;

    if (!headers['content-type']) {
        throw new validationError('Missing Content-Type header', 400);
    }
};

export const hasValidNewRecordFields = (req) => {
    if (
        !req.from ||
        !emailRegex.test(req.from) ||
        !req[process.env.CLIENT_ONE_COLUMN] ||
        !req[process.env.CLIENT_TWO_COLUMN] ||
        !req.subject ||
        !req.text
    ) {
        throw new validationError('Missing fields');
    }
};

export const hasValidAPIKey = (req) => {
    const apiKey = req.headers['api-key'];
    const envApiKey = process.env.API_KEY;

    if (!apiKey) {
        throw new validationError('API key is required', 401);
    }

    if (apiKey !== envApiKey) {
        throw new validationError('Invalid API key', 403);
    }
};
