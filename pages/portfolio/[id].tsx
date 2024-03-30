import Layout from '../../components/Layout'
import { GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import { useEffect } from 'react'
import Link from 'next/link'

// ポートフォリオ項目の型定義
type PortfolioItem = {
  id: string
  title: string
  title_en: string
  technologies: string[]
  pcScreenshots: string[]
  mobileScreenshots: string[]
  themeColor: string
  url: string
  role: string
  clientName: string
  description: string
  ja_description: string
  logoImage: string
}

// ページコンポーネントのPropsの型定義
type PortfolioProps = {
  item: PortfolioItem
}

export default function Portfolio({ item }: PortfolioProps) {
  useEffect(() => {
    console.log(item.clientName)
  }, [])
  return (
    <div className="flex flex-col">
      <Layout>
        <div className="relative h-[50vh] md:h-[80vh] pb-[10vh] flex flex-col">
          <div className="flex flex-col md:flex-row items-center z-10">
            <div className="mx-auto w-11/12 md:ml-20 md:w-1/2 xl:w-7/12">
              <Image
                src={item.pcScreenshots[0]}
                alt={item.clientName}
                width={1650}
                height={1100}
              />
            </div>
            <div className="hidden md:block mr-auto">
              <Image
                src={item.logoImage}
                alt={item.clientName}
                width={400}
                height={86.67}
              />
            </div>
          </div>
          <div
            className="absolute top-1/2 md:top-2/3 xl:top-3/4 left-0 w-full h-1/2 md:h-1/3"
            style={{ backgroundColor: item.themeColor }}
          ></div>
        </div>
        <div className="relative min-h-[80vh] mt-[20vh] flex flex-col justify-center w-11/12 md:w-3/4 xl:w-2/3 mx-auto">
          <div className="flex flex-col md:flex-row justify-between tracking-[.25em]">
            <div className="flex flex-col mb-10 md:mb-0 md:mr-5">
              <h2 className="text-xl md:text-3xl xl:text-4xl font-bold">
                {item.clientName == 'N/A'
                  ? item.title_en
                    ? item.title_en
                    : item.title
                  : item.clientName}
              </h2>
              <h1 className="text-4xl md:text-7xl xl:text-8xl font-bold">
                {item.title}
              </h1>
            </div>
            <div className="border-t-2 md:border-t-none md:border-l-2 border-[#9C9C9B]"></div>
            <div className="mt-10 md:pl-5 md:my-auto flex flex-col justify-center leading-relaxed text-base md:text-xl xl:text-2xl text-[#9C9C9B]">
              <div>
                {item.technologies.map((technology, index) => (
                  <p key={index}>{technology}</p>
                ))}
              </div>
            </div>
          </div>
          <div
            className="text-lg md:text-xl xl:text-2xl font-bold mt-20 md:mt-32 leading-loose"
            dangerouslySetInnerHTML={{
              __html: item.ja_description.replace(/\n/g, '<br>'),
            }}
          ></div>
          <div className="w-full mt-12 md:mt-20 shadow-2xl">
            <Image
              src={item.pcScreenshots[1]}
              alt={item.clientName}
              width={4000}
              height={6126}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row md:justify-around mt-12 md:mt-20">
            <div className="w-3/4 md:w-1/3 mx-auto">
              <Image
                src={item.mobileScreenshots[0]}
                alt={item.clientName}
                width={2560}
                height={4780}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="w-3/4 md:w-1/3 mx-auto">
              <Image
                src={item.mobileScreenshots[1]}
                alt={item.clientName}
                width={2560}
                height={4780}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className="w-full mt-16 md:mt-28 border-b-2 border-black"></div>
          <div className="justify-between w-full mt-16 md:mt-28 flex flex-col md:flex-row">
            <div className="flex flex-col text-lg md:text-xl xl:text-2xl font-bold leading-loose">
              <p>Website</p>
              <Link href={item.url} passHref className="text-[#002066]">
                {item.url}
              </Link>
            </div>
            <div className="flex flex-col text-lg md:text-xl xl:text-2xl font-bold leading-loose md:mr-0 md:ml-auto">
              <p className="md:ml-auto">Client: {item.clientName}</p>
              <p className="md:ml-auto">Role: {item.role}</p>
            </div>
            <div className="flex flex-col"></div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

// ビルド時に静的なページを生成するためのデータを取得
export const getStaticProps: GetStaticProps = async (context) => {
  const id =
    typeof context.params?.id === 'string'
      ? context.params.id
      : context.params?.id[0]
  const filePath = path.join(process.cwd(), 'public/portfolio.json')
  const jsonData = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(jsonData)
  const item = data[id]

  return {
    props: {
      item,
    },
  }
}

// 生成する静的ページのパスを定義
export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), 'public/portfolio.json')
  const jsonData = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(jsonData)
  const paths = Object.keys(data).map((id) => ({
    params: { id },
  }))

  return {
    paths,
    fallback: false,
  }
}
