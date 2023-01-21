import type { GetServerSideProps } from "next";
import { SitemapStream, streamToPromise } from "sitemap";
import Notion from "@/integrations/notion";
import { env } from "@/env/server.mjs";
import type { DatabaseResponse } from "@/types/notion";

const addPostToSitemap = async (smStream: SitemapStream) => {
  // List of posts
  const database = (await Notion.databases.query({
    database_id: env.DATABASE_ID
  })) as unknown as DatabaseResponse;
  const posts = database.results;

  // // Add each posts in sitemap
  posts.forEach((post) => {
    const type = post.cover?.type;
    const cover = type && post.cover?.[type];
    const date = new Date(post.properties.Date.date?.start || "now").toISOString();
    smStream.write({
      url: `/posts/${post.id}`,
      priority: 0.7,
      lastmod: date,
      img: {
        url: cover?.url
      },
      news: {
        publication: {
          name: post.properties.Name.title[0].plain_text,
          language: "fr"
        },
        publication_date: date,
        title: post.properties.Name.title[0].plain_text,
        keywords: post.properties.Tags.multi_select.map((tag) => tag.name).join(",")
      }
    });
  });
};

const addNavigationToSitemap = async (smStream: SitemapStream) => {
  const navigation = [
    { href: "/", priority: 1 },
    { href: "/posts", priority: 0.9 },
    { href: "/about", priority: 0.9 },
    { href: "/contact", priority: 0.9 }
  ];

  const lastModDefault = new Date().toISOString();
  navigation.forEach((item) => {
    smStream.write({
      url: `${item.href}`,
      priority: item.priority,
      lastmod: lastModDefault
    });
  });
};


export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const smStream = new SitemapStream({
      hostname: `https://vahor.fr`
    });

    await addPostToSitemap(smStream);
    await addNavigationToSitemap(smStream);

    // End sitemap stream
    smStream.end();

    // XML sitemap string
    const sitemapOutput = (await streamToPromise(smStream)).toString();

    /**  Set Cache Control in vercel @see https://vercel.com/docs/edge-network/caching#stale-while-revalidate */
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.setHeader("Content-Type", "application/xml");
    res.write(sitemapOutput);
    res.end();
  } catch (e) {
    console.log(e);
    res.end();
  }

  return {
    props: {}
  };
};

const SitemapXML = () => {
  return null;
};

export default SitemapXML;