import Head from "next/head";
import Link from "next/link";
import { getDatabase, getDatabaseWithTimeStamp } from "../../../lib/notion";
import { Text } from "../[id]";
import styles from "./index.module.css";
import Layout from "../../../components/Layout";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Blog({ posts, tags, currentTag }) {
  return (
    <div>
      <Head>
        <title>Notion Next.js blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
      <main className="w-1/2 mt-20 mx-auto">
        <h2 className="text-3xl pb-5 border-b-2 border-dotted border-black">#{currentTag}</h2>
        <ol className="mt-5">
          {posts.map((post) => {
            const date = new Date(post.last_edited_time).toLocaleString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            );
            return (
              <li key={post.id} className="hover-yellow my-10">
                <div className="flex flex-row text-sm">
                {post.properties.Tag.multi_select.map((tag, index) => {
                  if(index < post.properties.Tag.multi_select.length - 1){
                    return(
                      <Link href={`/blog/tag/${tag.name}`} className="text-blue-300" data-id={tag.id}>#{tag.name},&nbsp;</Link>
                    )
                  } else{
                    return(
                      <Link href={`/blog/tag/${tag.name}`} className="text-blue-300" data-id={tag.id}>#{tag.name}</Link>
                    )
                  }
                })}
                </div>
                <p className="text-gray-800">{date}</p>
                <h3 className="text-2xl">
                  <Link href={`/blog/${post.id}`}>
                    <Text text={post.properties.Name.title} />
                  </Link>
                </h3>
                <Link href={`/blog/${post.id}`}>Read post →</Link>
              </li>
            );
          })}
        </ol>
      </main>
      </Layout>
    </div>
  );
}


export const getStaticPaths = async () => {
    const database = await getDatabase(databaseId);
    const uniqueTags = new Set<{id:string, name:string, color:string}>();
    database.map((post:PageObjectResponse) => {
        const tagsProp = post.properties.Tag as { id: string, type: string, multi_select: Array<{id:string, name:string, color:string}> };
        const tags = tagsProp.multi_select;
        tags.map(tag => {
          uniqueTags.add(tag);
        });
    })

    const paths = Array.from(uniqueTags).map(tag => ({ params: { tag: tag.name } }));

    return {
      paths: paths,
      fallback: true,
    };
  };


export const getStaticProps = async (context) => {
    const { tag } = context.params;
    const database = await getDatabaseWithTimeStamp(databaseId, tag);
    const uniqueTags = new Set<{id:string, name:string, color:string}>();
    database.map((post:PageObjectResponse) => {
        const tagsProp = post.properties.Tag as { id: string, type: string, multi_select: Array<{id:string, name:string, color:string}> };
        const tags = tagsProp.multi_select;
        tags.map(tag => {
          uniqueTags.add(tag);
        });
    })

  
    return {
      props: {
        posts: database,
        tags:Array.from(uniqueTags),
        currentTag:tag
      },
      revalidate: 1,
    };
  };
  