/* NETLIFY SERVERLESS FUNCTION 
  File: /netlify/functions/send-email.js
*/

const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { email, hash, pdf } = JSON.parse(event.body);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: 'noreply@signflow-enterprise.com',
      subject: 'Secure Document: Finalized & Sealed',
      text: `A document with Integrity Seal ${hash} has been securely shared with you.`,
      attachments: [
        {
          content: pdf,
          filename: 'sealed-document.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    await sgMail.send(msg);
    return { statusCode: 200, body: JSON.stringify({ status: "Sent" }) };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
