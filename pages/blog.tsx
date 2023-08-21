import Head from "next/head";
import Link from "next/link";
import { getDatabase, getDatabaseWithTimeStamp } from "../lib/notion";
import { Text } from "./blog/[id]";
import Layout from "../components/Layout";
import {Page} from "../types/notion-blog-type"
import { SearchSelect } from "../components/SearchSelect";

export const databaseId = process.env.NOTION_DATABASE_ID;


export default function Blog({ posts, year_month_list, tag_list }) {
  
  return (
    <div>
      <Head>
        <title>Notion Next.js blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
      <main className="flex flex-row mt-10 mx-auto">
        <div>
          
        </div>
        <div className="ml-40 w-1/6">
          <h2 className="text-3xl pb-5 border-b-2 border-dotted border-black">Filter</h2>
          <div className="my-10">
          <SearchSelect name="monthSelect"  labelTitle="月を選択" optionList={year_month_list} selected="" pathname="/blog"/>
          </div>
          <div>
          <SearchSelect name="tagSelect"  labelTitle="タグを選択" optionList={tag_list} selected="" pathname="/blog"/>
          </div>
        </div>
        <div className="w-1/2 mr-40 ml-auto">
        <h2 className="text-3xl pb-5 border-b-2 border-dotted border-black">All Posts</h2>
        <ol className="mt-5">
          {posts.map((post) => {
            console.log(post.properties.Date.date)
            const date = new Date(post.properties.Date.date.start).toLocaleString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            );
            const lastEditedDate = new Date(post.last_edited_time).toLocaleString(
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
                <div className="flex flex-row">
                <p className="text-gray-800 mr-3">Last updated: {lastEditedDate}</p>
                <p className="text-gray-800">First wrote: {date}</p>
                </div>
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
        </div>
      </main>
      </Layout>
    </div>
  );
}

export const getStaticProps = async () => {
  const database:Page[] = await getDatabaseWithTimeStamp(databaseId) as unknown as Page[];

  let year_month_list: { [yyyymm: string]: Page[] } = {}
  // 記事のtagを取得、数を取得してリストにする。tag:article数のobject
  //{tag1:4, tag2:8,.....}
  let tag_list: { [tag: string]: Page[] } = {}
  await Promise.all(
    database.map(async (item) => {
      let date = new Date(item.last_edited_time)
      let yyyymm =
        date.getFullYear().toString() +
        '/' +
        ('00' + (date.getMonth() + 1).toString()).slice(-2)
      if (year_month_list[yyyymm]) {
        year_month_list[yyyymm].push(item)
      } else {
        year_month_list[yyyymm] = new Array(
          item
        )
      }
      await Promise.all(
        item.properties.Tag.multi_select.map((tag) => {
          if (tag_list[tag.name]) {
            tag_list[tag.name].push(item)
          } else {
            tag_list[tag.name] = new Array(item)
          }
        })
      )
    })
  )

  return {
    props: {
      posts: database,
      year_month_list,
      tag_list,
    },
    revalidate: 1,
  };
};
