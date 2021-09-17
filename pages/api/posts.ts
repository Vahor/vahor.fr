// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Notion from 'integrations/notion'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    posts: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { folder } = req.query
    const posts = await Notion.databases.query({
        database_id: process.env.DATABASE_ID,
    })
    res.status(200).json(posts?.results)
}
