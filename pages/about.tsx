import Layout from '../components/Layout'
import Image from 'next/image'

export default function About() {
  return (
    <div className="flex flex-col relative">
      <Layout>
        <div className="font-reitam relative h-[80vh] leading-loose tracking-[0.5em] md:tracking-[1em] pb-[10vh] flex flex-col justify-center items-center">
          <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold">
            Thoughts in the Rough
          </h1>
          <p className="text-center mt-5 font-bold text-xl md:text-xl xl:text-3xl font-bebas">
            This is a place to share my thoughts..
          </p>
        </div>
        <div className="w-11/12 md:w-2/3 mx-auto flex flex-row justify-between tracking-[.25em]">
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold">
              Developer
            </h2>
            <h1 className="text-3xl md:text-6xl xl:text-8xl font-bold">
              Takuya Shinozaki
            </h1>
          </div>
          <div className="border-l-2 border-[#9C9C9B]"></div>
          <div className="flex flex-col justify-center leading-relaxed my-auto text-lg md:text-2xl text-[#9C9C9B]">
            <div>
              <p>Web App</p>
              <p>Mobile App</p>
              <p>Generative AI</p>
              <p>Web Design</p>
            </div>
          </div>
        </div>
        <div className="w-5/6 md:w-2/3 mx-auto flex flex-col mt-20 text-lg md:text-xl justify-between tracking-[.25em]">
          <p>1989年生まれ。バンクーバー在住。</p>
          <br />
          <p>
            趣味や興味のあることを中心に、プログラミングやデザイン、ゲーム制作などを行っています。モットーは中途半端でもいいから作ること。道草を楽しむこと。{' '}
            <br />
            完璧を目指すよりも、作る過程そのものを楽しんでいます。
            <br />
            <br />
            同じ趣味を持つ人たちと繋がるための場所として、このサイトを作りました。
          </p>
        </div>
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10"
          style={{ pointerEvents: 'none' }}
        >
          <Image
            src="/images/portfolio_pic.png"
            alt=""
            width={700}
            height={700}
          />
        </div>
      </Layout>
    </div>
  )
}
