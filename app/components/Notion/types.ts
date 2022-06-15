export interface NotionContent {
    results: NotionBlock[]
}

export enum NotionBlockType {
    heading_1 = "heading_1",
    heading_2 = "heading_2",
    heading_3 = "heading_3",
    paragraph = "paragraph",
    bulleted_list_item = "bulleted_list_item",
    numbered_list_item = "numbered_list_item",
    to_do = "to_do",
    toggle = "toggle",
    image = "image",
    bookmark = "bookmark",
    table_of_contents = "table_of_contents",
    divider = "divider",
    code = "code",
    unsupported = "unsupported"
}

export type NotionBlock = {
    [type in NotionBlockType]: NotionBlockContent;
} & {
    id: string;
    created_time: Date;
    last_edited_time: Date;
    has_children: boolean;
    archived: boolean;
    type: NotionBlockType;
    image?: NotionBlockImageContent,
    bookmark?: NotionBlockBookmarkContent,
};

export interface NotionBlockContent {
    rich_text: TextElement[];
}

export interface NotionBlockBookmarkContent {
    url: string;
    meta: { // Custom
        title: string
        description: string
        image: CustomImageContent
    }
}

export interface CustomImageContent {
    url: string
    width: number
    height: number
    blur: string
}

export interface NotionBlockImageContent {
    caption?: TextElement[];
    external: CustomImageContent
}
export interface NotionBlockTodoContent extends NotionBlockContent {
    checked: boolean
}

export interface TextElement {
    type: string;
    text: TextText;
    annotations: Annotations;
    plain_text: string;
    href: string;
}

export interface Annotations {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
}

export interface TextText {
    content: string;
    link: null;
}