import { NextApiRequest, NextApiResponse } from 'next';

import * as sgMail from "@sendgrid/mail"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        if (!process.env.SENDGRID_API_KEY)
            return res.status(502).end();

        const { subject, text, name, from } = req.body;

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const content = {
            html: text?.replace(/\r\n/g, '<br>') || "",
            to: "me@vahor.fr",
            subject: `[Vahor.fr] - ${from} (${name}) - ${subject}`,
            text: text,
            from: from,
        }

        return await sgMail.send(content).then(() => {
            return res.status(200).end();
        }).catch(err => {
            console.log(err)
            console.log(err.response)

            return res.status(err.code || 500).end();
        });
    }

    return res.status(404).end();
}

export default handler