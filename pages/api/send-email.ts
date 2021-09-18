import { NextApiRequest, NextApiResponse } from 'next';
import mailer from "@/lib/mailer"


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        if (!process.env.MAILER_SMTP_HOST)
            return res.status(502).end();

        const { subject, text, name, from } = req.body;

        // A database would do the same thing but why not use email :)
        // At least I have notification when someone send a message
        const content = {
            html: text?.replace(/\r\n/g, '<br>') || "",
            to: "me@vahor.fr",
            from: "me@vahor.fr",
            subject: `[Vahor.fr] - ${from} (${name}) - ${subject}`,
            text: text,
        }


        return await mailer.sendMail(content).then(() => {
            return res.status(200).end();
        }).catch(err => {
            return res.status(err.code || 500).end();
        });
    }

    return res.status(404).end();
}

export default handler