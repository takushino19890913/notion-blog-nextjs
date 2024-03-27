import Head from 'next/head'
import Layout from '../components/Layout'
import ThreeDModel from '../components/ThreeDModel'
import TypewriterText from '../components/TypewriterText'
import FloatThreeDModel from '../components/FloatThreeDModel'
import { ScrollDown } from '../components/ScrollDown'
import ParticlesComponent from '../components/ParticlesComponent'
import HeaderCard from '../components/HeaderCard'
import DelayScrollAnimation from '../components/DelayScrollAnimation'
import Carousel from '../components/Carousel'
import TextMultilineOverflow from '../components/TextMultilineOverflow'
import { useEffect, useRef, useState } from 'react'

export const databaseId = process.env.NOTION_DATABASE_ID

export default function Home() {
  const [isInViewOrange, setIsInViewOrange] = useState(false)
  const [isInViewBlack, setIsInViewBlack] = useState(false)
  const [snapContainer, setSnapContainer] = useState<HTMLElement>(null)

  const refOrange = useRef(null)
  const refBlack = useRef(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSnapContainer(document.getElementById('snapContainer'))
      console.log('checking')
      if (document.getElementById('snapContainer')) {
        clearInterval(intervalId)
      }
    }, 500) // 500msごとに実行

    // コンポーネントのアンマウント時に間隔をクリア
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    console.log('snapContainer: ', snapContainer)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === refOrange.current) {
              setTimeout(() => {
                setIsInViewOrange(true)
              }, 1000)
            } else if (entry.target === refBlack.current) {
              setTimeout(() => {
                setIsInViewBlack(true)
              }, 1500)
            }
          }
        })
      },
      {
        root: snapContainer,
        threshold: 0.1,
      }
    )

    if (refOrange.current) {
      observer.observe(refOrange.current)
    }

    if (refBlack.current) {
      observer.observe(refBlack.current)
    }

    return () => {
      if (refOrange.current) observer.unobserve(refOrange.current)
      if (refBlack.current) observer.unobserve(refBlack.current)
    }
  }, [isInViewOrange, isInViewBlack, snapContainer])

  return (
    <div className="flex flex-col">
      <Layout>
        <div className="relative h-[80vh] pb-[20vh] flex flex-col md:flex-row md:justify-center items-center md:snap-start">
          <ParticlesComponent />
          <div className="md:mb-5 w-full md:w-2/5 flex flex-col md:flex-row items-center justify-center">
            <div className="flex flex-col items-center justify-around">
              <TypewriterText
                text="Hello;"
                speed={100}
                delay={1000}
                className="text-8xl xl:text-9xl font-black"
              />
              <TypewriterText
                text="I am Takuya!! I like making things!"
                speed={100}
                delay={3000}
                className="text-lg md:text-2xl mt-5 italic text-center"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-full relative h-[60vh] md:h-[80vh] m-auto">
              <FloatThreeDModel />
            </div>
          </div>
          <ScrollDown
            animStatus="isInScreen"
            cursor="cursor-pointer"
            scrollClass="scroll-anim scroll-green"
          />
        </div>
        <div className="min-h-[80vh] relative snap-start w-3/4 mx-auto pt-[5vh]">
          <DelayScrollAnimation>
            <div className="h-full flex flex-row">
              <div className="hidden md:block flex-col flex w-1/2">
                <p className="w-full">
                  WEB APP / GENERATIVE AI / WEB DESIGN / MOBILE APP
                </p>
                <h2 className="text-6xl font-bold mt-[15vh]">
                  <span
                    ref={refOrange}
                    className={
                      isInViewOrange
                        ? 'highlighter-orange inline-block'
                        : 'inline-block'
                    }
                  >
                    <span>CRAFT</span>
                  </span>
                </h2>
                {/* <h2 className="text text-6xl font-bold mt-5">
                <span ref={refBlack} className={isInViewBlack ? "highlighter-black" : ""}>
                  <span className="text-original">CODING</span>
                  <span className="text-clone">CODING</span>
                </span>
                </h2> */}
                <h2 className="text-6xl font-bold mt-5">
                  <span
                    className={
                      isInViewBlack
                        ? 'inline-block highlighter-black'
                        : 'inline-block'
                    }
                    ref={refBlack}
                    data-txt="CODING"
                  >
                    CODING
                  </span>
                </h2>
              </div>
              <div className="absolute mx-auto left-[2vh] md:left-auto md:right-[10vh] top-[18vh] md:top-[12vh] w-11/12 md:w-1/3 max-h-[80vh] overflow-hidden text-ellipsis whitespace-nowrap">
                <TextMultilineOverflow className="min-h-[50vh] max-h-[50vh] text-lg leading-loose">
                  こんにちは、篠崎拓也と申します。
                  <br />
                  私は主にWebアプリケーション開発を行っています。Next.js、React.js、TypeScript、Tailwind.cssを用いたフロントエンド開発を得意としており、ChatGPTなどの生成AIを活用したアプリケーション開発にも取り組んでいます。
                  <br />
                  <br />
                  これまでに日本語学校のウェブサイトや、個人開発のウェブアプリの開発に携わってきました。常にクライアントやユーザーの視点に立ち、高品質なコードを書くことを心がけています。
                  <br />
                  <br />
                  また、チームワークを大切にしており、コミュニケーションを通じて課題解決に努めます。新しい技術やアイデアにも積極的に挑戦し、自己成長を続けています。
                  <br />
                  <br />
                  このポートフォリオサイトでは、私の開発スキルや実績をご覧いただけます。ご興味がありましたら、ぜひお気軽にお問い合わせください。お仕事のご相談を心よりお待ちしております。
                  <br /> Takuya Shinozaki
                </TextMultilineOverflow>
              </div>
              <HeaderCard
                className="w-11/12 md:w-1/3 absolute md:-top-[5vh] md:right-[10vh]"
                engTitle="About"
                jpTitle="自己紹介"
                orientation="landscape"
                href="/about"
              />
            </div>
          </DelayScrollAnimation>
        </div>
        <div className="relative snap-start pt-[5vh]">
          <DelayScrollAnimation>
            <div className="mx-auto relative w-11/12 md:w-3/4 flex flex-col md:flex-row md:justify-around items-center md:my-auto">
              <HeaderCard
                className="hidden md:block h-full lg:h-full absolute -top-[4vh] -left-[11vh]"
                engTitle="Works"
                jpTitle="作品"
                orientation="portrait"
              />
              <HeaderCard
                className="block md:hidden"
                engTitle="Works"
                jpTitle="作品"
                orientation="landscape"
              />
              <Carousel
                images={[
                  {
                    src: '/images/thoughts_in_the_rough/thoughts_in_the_rough_top_portrait.png',
                    href: '/portfolio/thoughts-in-the-rough',
                  },
                  {
                    src: '/images/jp-class/jp-class-top-portrait.png',
                    href: '/portfolio/jp-class',
                  },
                  {
                    src: '/images/terakoya/terakoya-top-portrait.png',
                    href: '/portfolio/terakoya',
                  },
                ]}
              />
            </div>
          </DelayScrollAnimation>
        </div>
      </Layout>
    </div>
  )
}
