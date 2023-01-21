export type DatabaseResponse = {
  object: "list"
  results: Page[]
  next_cursor: string | null
  has_more: boolean
}

export type Page = {
  object: "page"
  id: string
  created_time: string
  last_edited_time: string
  cover: null | {
    type: "file" | "external"
    file: {
      url: string
    }
    external: {
      url: string
    }
  }
  properties: {
    Date: {
      date: {
        start: string
        end: string
      }
    },
    Tags: {
      multi_select: {
        name: string
        color: string
      }[]
    }
    Name: {
      title: {
        plain_text: string
      }[]
    },
    Summary: {
      rich_text: {
        plain_text: string
      }[]
    }
  }

}