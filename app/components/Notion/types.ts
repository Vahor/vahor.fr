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
};

export interface NotionBlockContent {
    text: TextElement[];
}

export interface NotionBlockImageContent {
    caption?: TextElement[];
    external: {
        url: string;
    }
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