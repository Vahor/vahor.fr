const { Client } = require("@notionhq/client")

const Notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export default Notion
