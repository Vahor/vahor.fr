import { NextApiRequest, NextApiResponse } from 'next';

import { sendEmail } from '@/lib/sendgrid';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { subject, text, name, from } = req.body;
        return sendEmail({ subject, text, name, from }).then(() => {
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