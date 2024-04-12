import { EOL } from 'os';

export const findUUIDs = (text) => {
    const pattern = /Ticket\snumber:\s([\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12})/i;
    const matches = text.match(pattern);
    if (matches) {
        return matches[1];
    }
    console.error('No thread ref found on text: ', text);
    throw new Error('No thread ref found!');
};

export const addUUIDToText = (text, uuid) => {
    return text + EOL + EOL + 'Ticket number: ' + uuid;
};

export const addUUIDToHTML = (uuid) => {
    return (
        `<span style="font-size: 8px; color: #999;"> Ticket number: ${uuid}</span>`
    );
};

export const aadFooterToHTML = (html, uuid) => {
    const ticketElement = addUUIDToHTML(uuid);
    const footer = `
    <br>
    <hr style="border-top: 1px solid #ddd; margin-bottom: 5px;">
    <p style="font-size: 8px; color: #999;">This email message and any attachments are for the exclusive use of the intended addressee(s). This message may contain confidential, privileged and/or proprietary information, and unauthorized review, use or distribution by persons other than the intended addressee(s) is strictly prohibited and may be unlawful. Unintended transmission does not waive any privilege including attorney-client, attorney work product or claims to confidentiality. ${ticketElement}</p>
  `;

    return html + footer;
};
