import { EOL } from 'os';

export const findUUIDs = (text) => {
    const pattern = /Thread\sref:\s([\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12})/i;
    const matches = text.match(pattern);
    if (matches) {
        return matches[1];
    }
    console.error('No thread ref found on text: ', text);
    throw new Error('No thread ref found!');
};

export const addUUIDToText = (text, uuid) => {
    return text + EOL + EOL + 'Thread ref: ' + uuid;
};

export const addUUIDToHtml = (html, uuid) => {
    return (
        html +
        `<br /><br /><br /><span style="font-size: 12px; color: #999;">Thread ref: ${uuid}</span>`
    );
};
