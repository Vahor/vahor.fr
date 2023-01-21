export const PostStatusMap = {
    ALL: "Tous",
    FINISHED: "Terminé",
    PROGRESS: "En cours"
} as const;
export type PostStatus = keyof typeof PostStatusMap;
export const getStatusByValue = (value: string): PostStatus => {
    return Object.keys(PostStatusMap).find(key => {
        // @ts-expect-error: key is a string
        return PostStatusMap[key] === value;
    }) as PostStatus || "PROGRESS";
}
