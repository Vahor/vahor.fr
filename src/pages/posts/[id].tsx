import React from "react";
import type {GetStaticPaths, GetStaticProps, NextPage} from "next";
import Notion from "@/integrations/notion";
import {Meta} from "@/components/meta";
import type {Page} from "@/types/notion";
import {NotionPageContent} from "@/components/Notion/NotionPageContent";
import type {NotionContent} from "@/components/Notion/types";
import {extractMetaTags} from "@/integrations/scraper";
import {getPlaiceholder} from "plaiceholder";

export const getStaticPaths: GetStaticPaths = async () => {
    return {paths: [], fallback: true};
};

export const getStaticProps: GetStaticProps = async (context) => {
    const id = context.params?.id as string;
    const post = await Notion.pages.retrieve({
        page_id: id,
    }) as Page;

    const content = await Notion.blocks.children.list({
        block_id: id,
        page_size: 100, // max 100
    }) as unknown as NotionContent;

    content.results = await Promise.all(
      Object.values(content?.results).map(async (block) => {
        if (block.type === "bookmark") {
          const meta = await extractMetaTags(block.bookmark.url);
          const { base64, img } = await getPlaiceholder(meta.image, { size: 10 });

          block["bookmark"].meta = {
            title: meta.title,
            description: meta.description.substring(0, 100),
            image: {
              url: meta.image,
              blur: base64,
              width: img.width,
              height: img.height,
            },
          };
        }

        return block;
      })
    );

    const parsedPost = {
        title: post.properties.Name.title[0].plain_text,
        cover: '',
        description: post.properties.Summary.rich_text[0].plain_text,
    }
    const coverType = post.cover?.type
    if (coverType && post.cover?.[coverType]) {
        parsedPost.cover = post.cover[coverType].url
    }

    return {
        props: {
            post: parsedPost,
            content,
        },
        revalidate: 5 * 60, // every 5 minutes
    };
};

interface PostPageProps {
    post: {
        title: string;
        cover: string;
        description: string;
    };
    content: NotionContent;
}

const PostPage: NextPage<PostPageProps> = ({post, content}) => {
    if (!post || !content) {
        return (
            <>
                <Meta title={"Chargement"} contentType={"article"}/>

                <article
                    className={`py-8 container prose lg:prose-lg dark:prose-dark max-w-none base`}
                >
                    <h1 className="pb-16 skeleton !mb-4"/>
                    <p className="pb-24 mb-12 skeleton"/>
                    <div className="border-b dark:border-gray-800"/>

                    <h2 className="pb-8 skeleton"/>
                    <span className="pb-8 mb-1 skeleton"/>
                    <span className="w-3/4 pb-6 mb-1 skeleton"/>
                    <span className="pb-6 mb-1 skeleton"/>
                    <span className="w-4/5 pb-6 mb-1 skeleton"/>
                    <span className="pb-6 mb-12 skeleton"/>

                    <h2 className="pb-8 skeleton"/>
                    <span className="pb-8 mb-1 skeleton"/>
                    <span className="pb-6 mb-1 skeleton"/>
                    <span className="w-3/4 pb-6 mb-1 skeleton"/>
                    <span className="w-3/4 pb-6 mb-1 skeleton"/>
                    <span className="pb-6 mb-12 skeleton"/>

                    <span className={`py-64 skeleton mb-2 wide`}/>
                    <h2 className="pb-8 mb-12 skeleton"/>

                    <h2 className="pb-8 skeleton"/>
                    <span className="pb-8 mb-1 skeleton"/>
                    <span className="pb-6 mb-1 skeleton"/>
                    <span className="w-3/4 pb-6 mb-1 skeleton"/>
                    <span className="w-3/4 pb-6 mb-1 skeleton"/>
                </article>
            </>
        );
    }

    return (
        <>
            <Meta
                title={post.title}
                imageUrl={post.cover}
                contentType="article"
            />

            <div
                className={`pt-8 container prose lg:prose-lg dark:prose-dark max-w-none base`}
            >
                <h1 className="font-bold text-3xl md:text-5xl !mb-4">
                    {post.title}
                </h1>
                <p className="pb-12 border-b dark:border-gray-500">
                    {post.description}
                </p>
            </div>

            <NotionPageContent page={content}/>
        </>
    );
};

export default PostPage;
