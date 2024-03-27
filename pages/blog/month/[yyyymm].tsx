import Head from 'next/head'
import Link from 'next/link'
import {
  getDatabase,
  getDatabaseForMonth,
  getDatabaseWithTimeStamp,
} from '../../../lib/notion'
import { Text } from '../[id]'
import styles from './index.module.css'
import Layout from '../../../components/Layout'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { SearchSelect } from '../../../components/SearchSelect'
import { Page } from '../../../types/notion-blog-type'

export const databaseId = process.env.NOTION_DATABASE_ID

export default function Blog({
  posts,
  currentMonth,
  year_month_list,
  tag_list,
}) {
  console.log('posts: ', posts)
  if (posts && currentMonth) {
    return (
      <div>
        <Head>
          <title>Notion Next.js blog</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
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
                  selected={currentMonth.slice(0, 4) + currentMonth.slice(4)}
                  pathname="/blog"
                />
              </div>
              <div>
                <SearchSelect
                  name="tagSelect"
                  labelTitle="タグを選択"
                  optionList={tag_list}
                  selected=""
                  pathname="/blog"
                />
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:mr-40 md:ml-auto mx-auto w-5/6 md:w-1/2">
              <h2 className="text-3xl pb-5 border-b-2 border-dotted border-black">
                {currentMonth}
              </h2>
              <ol className="mt-5">
                {posts &&
                  posts.map((post) => {
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
                          {post.properties.Tag.multi_select.map(
                            (tag, index) => {
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
                            }
                          )}
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
  } else {
    ;<></>
  }
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId)
  const dates = new Set<Date>()
  database.map((post: PageObjectResponse) => {
    const dateProp = new Date(post.last_edited_time)
    dates.add(dateProp)
  })

  const paths = Array.from(dates).map((date) => ({
    params: {
      yyyymm:
        date.getFullYear().toString() +
        '/' +
        ('00' + (date.getMonth() + 1).toString()).slice(-2),
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps = async (context) => {
  const { yyyymm } = context.params
  const database: Page[] = (await getDatabaseForMonth(
    databaseId,
    yyyymm
  )) as unknown as Page[]
  const dates = new Set<Date>()
  database.map((post: Page) => {
    const dateProp = new Date(post.created_time)
    dates.add(dateProp)
  })
  const databaseAll: Page[] = (await getDatabaseWithTimeStamp(
    databaseId
  )) as unknown as Page[]

  let year_month_list: { [year_month: string]: Page[] } = {}
  // 記事のtagを取得、数を取得してリストにする。tag:article数のobject
  //{tag1:4, tag2:8,.....}
  let tag_list: { [tag: string]: Page[] } = {}
  await Promise.all(
    databaseAll.map(async (item) => {
      let date = new Date(item.last_edited_time)
      let year_month =
        date.getFullYear().toString() +
        '/' +
        ('00' + (date.getMonth() + 1).toString()).slice(-2)
      if (year_month_list[year_month]) {
        year_month_list[year_month].push(item)
      } else {
        year_month_list[year_month] = new Array(item)
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
      currentMonth: yyyymm,
      year_month_list,
      tag_list,
    },
    revalidate: 1,
  }
}
