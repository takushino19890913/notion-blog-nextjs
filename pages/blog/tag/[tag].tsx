import Head from 'next/head'
import Link from 'next/link'
import { getDatabase, getDatabaseWithTimeStamp } from '../../../lib/notion'
import { Text } from '../[id]'
import styles from './index.module.css'
import Layout from '../../../components/Layout'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { SearchSelect } from '../../../components/SearchSelect'
import { Page } from '../../../types/notion-blog-type'

export const databaseId = process.env.NOTION_DATABASE_ID

export default function Blog({
  posts,
  tags,
  currentTag,
  year_month_list,
  tag_list,
}) {
  return (
    <div>
      <Layout>
        <main className="mt-5 md:mt-20 mx-auto flex flex-col md:flex-row">
          <div className="mx-auto w-5/6 md:ml-40 md:w-1/6">
            <h2 className="text-3xl pb-5 border-b-2 border-dotted border-black">
              Filter
            </h2>
            <div className="my-10">
              <SearchSelect
                name="monthSelect"
                labelTitle="月を選択"
                optionList={year_month_list}
                selected=""
                pathname="/blog"
              />
            </div>
            <div>
              <SearchSelect
                name="tagSelect"
                labelTitle="タグを選択"
                optionList={tag_list}
                selected={currentTag}
                pathname="/blog"
              />
            </div>
          </div>
          <div className="mt-10 md:mt-0 md:mr-40 md:ml-auto md:w-1/2 mx-auto w-5/6">
            <h2 className="text-3xl pb-5 border-b-2 border-dotted border-black">
              #{currentTag}
            </h2>
            <ol className="mt-5">
              {posts.map((post) => {
                const date = new Date(post.last_edited_time).toLocaleString(
                  'en-US',
                  {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  }
                )
                return (
                  <li key={post.id} className="hover-yellow my-10">
                    <div className="flex flex-row text-sm">
                      {post.properties.Tag.multi_select.map((tag, index) => {
                        if (
                          index <
                          post.properties.Tag.multi_select.length - 1
                        ) {
                          return (
                            <Link
                              href={`/blog/tag/${tag.name}`}
                              className="text-blue-300"
                              data-id={tag.id}
                            >
                              #{tag.name},&nbsp;
                            </Link>
                          )
                        } else {
                          return (
                            <Link
                              href={`/blog/tag/${tag.name}`}
                              className="text-blue-300"
                              data-id={tag.id}
                            >
                              #{tag.name}
                            </Link>
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
                )
              })}
            </ol>
            <Link href="/blog" className="inline-block my-[20px]">
              ← Go back
            </Link>
          </div>
        </main>
      </Layout>
    </div>
  )
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId)
  const uniqueTags = new Set<{ id: string; name: string; color: string }>()
  database.map((post: PageObjectResponse) => {
    const tagsProp = post.properties.Tag as {
      id: string
      type: string
      multi_select: Array<{ id: string; name: string; color: string }>
    }
    const tags = tagsProp.multi_select
    tags.map((tag) => {
      uniqueTags.add(tag)
    })
  })

  const paths = Array.from(uniqueTags).map((tag) => ({
    params: { tag: tag.name },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps = async (context) => {
  const { tag } = context.params
  const database: Page[] = (await getDatabaseWithTimeStamp(
    databaseId,
    tag
  )) as unknown as Page[]
  const uniqueTags = new Set<{ id: string; name: string; color: string }>()
  database.map((post: Page) => {
    const tagsProp = post.properties.Tag as {
      id: string
      type: string
      multi_select: Array<{ id: string; name: string; color: string }>
    }
    const tags = tagsProp.multi_select
    tags.map((tag) => {
      uniqueTags.add(tag)
    })
  })
  const databaseAll: Page[] = (await getDatabaseWithTimeStamp(
    databaseId
  )) as unknown as Page[]
  let year_month_list: { [yyyymm: string]: Page[] } = {}
  // 記事のtagを取得、数を取得してリストにする。tag:article数のobject
  //{tag1:4, tag2:8,.....}
  let tag_list: { [tag: string]: Page[] } = {}
  await Promise.all(
    databaseAll.map(async (item) => {
      let date = new Date(item.last_edited_time)
      let yyyymm =
        date.getFullYear().toString() +
        '/' +
        ('00' + (date.getMonth() + 1).toString()).slice(-2)
      if (year_month_list[yyyymm]) {
        year_month_list[yyyymm].push(item)
      } else {
        year_month_list[yyyymm] = new Array(item)
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
      tags: Array.from(uniqueTags),
      currentTag: tag,
      year_month_list,
      tag_list,
    },
    revalidate: 1,
  }
}
