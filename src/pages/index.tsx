import {Meta, OrganizationMeta} from "@/components/meta";
import type {GetStaticProps, NextPage} from "next";
import Notion from "@/integrations/notion";
import {env} from "@/env/server.mjs";
import type {DatabaseResponse} from "@/types/notion";
import {getPlaiceholder} from "plaiceholder";
import type {PostsProps} from "@/components/Home/Posts";
import {getStatusByValue} from "@/types/post";
import Posts from "@/components/Home/Posts";
import Brand from "@/components/Home/Brand";
import About from "@/components/Home/About";
import Contact from "@/components/Home/Contact";

const Home: NextPage<{
    results: PostsProps['posts'],
    tags: string[]
}> = ({results, tags}) => {
    return (
        <>
            <Meta title="Accueil"/>
            <OrganizationMeta/>
            <Brand />
            <Posts posts={results} tags={tags}/>
            <About />
            <Contact />
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const database = (await Notion.databases.query({
        database_id: env.DATABASE_ID,
        filter: {
            "and": [
                {
                    property: 'Project',
                    checkbox: {
                        equals: true,
                    },
                }
            ]
        }
    })) as unknown as DatabaseResponse;
    const posts = database.results;

    const tags: string[] = []
    const results = await Promise.all(posts.map(async post => {
        const result: PostsProps['posts'][number] = {
            id: post.id,
            title: post.properties.Name.title[0].plain_text,
            status: getStatusByValue(post.properties.Status.select.name),
            tags: post.properties.Tags.multi_select.map(tag => tag.name),
            cover: {
                url: "",
                blur: "",
                width: 0,
                height: 0
            }
        }
        const type = post.cover?.type
        if (type && post.cover?.[type]) {
            const {base64, img} = await getPlaiceholder(post.cover[type].url, {size: 10})
            result['cover'] = {
                url: post.cover[type].url,
                blur: base64,
                width: img.width,
                height: img.height,
            }
        }
        post.properties.Tags.multi_select.forEach(tag => {
            if (tags.indexOf(tag.name) === -1) tags.push(tag.name)
        })

        return result
    }));

    // Sort
    tags.sort();

    // "Autre" at the end
    const i = tags.indexOf("Autre")
    tags.splice(i, 1);
    tags.push("Autre")


    return {
        props: {
            results,
            tags
        },
        revalidate: 5 * 60 // every 5 minutes
    }
}

export default Home;

