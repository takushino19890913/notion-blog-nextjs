import Head from "next/head";
import Layout from "../components/Layout";
import ThreeDModel from '../components/ThreeDModel';
import TypewriterText from '../components/TypewriterText';
import FloatThreeDModel from "../components/FloatThreeDModel";
import { ScrollDown } from "../components/ScrollDown";
import ParticlesComponent from '../components/ParticlesComponent';
import HeaderCard from '../components/HeaderCard';
import DelayScrollAnimation from "../components/DelayScrollAnimation";
import Carousel from "../components/Carousel";
import TextMultilineOverflow from "../components/TextMultilineOverflow";
import { useEffect, useRef, useState } from 'react';

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home() {
  const [isInViewOrange, setIsInViewOrange] = useState(false);
  const [isInViewBlack, setIsInViewBlack] = useState(false);
  const [snapContainer, setSnapContainer] = useState<HTMLElement>(null);

  const refOrange = useRef(null);
  const refBlack = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSnapContainer(document.getElementById("snapContainer"));
      console.log("checking")
      if (document.getElementById("snapContainer")) {
        clearInterval(intervalId);
      }
    }, 500); // 500msごとに実行
  
    // コンポーネントのアンマウント時に間隔をクリア
    return () => clearInterval(intervalId);
  },[])

  useEffect(() => {
    console.log("snapContainer: ", snapContainer)
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === refOrange.current) {
              setTimeout(() => {
                setIsInViewOrange(true);
              }, 1000);
            } else if (entry.target === refBlack.current) {
              setTimeout(() => {
                setIsInViewBlack(true);
              }, 1000);
            }
          }
        });
      },
      {
        root: snapContainer,
        threshold: 0.1
      }
    );

    if (refOrange.current) {
      observer.observe(refOrange.current);
    }

    if (refBlack.current) {
      observer.observe(refBlack.current);
    }

    return () => {
      if (refOrange.current) observer.unobserve(refOrange.current);
      if (refBlack.current) observer.unobserve(refBlack.current);
    };
  }, [isInViewOrange, isInViewBlack, snapContainer]);

  return (
    <div className="flex flex-col">
      <Layout>
        <div className="relative h-[80vh] pb-[20vh] flex flex-row justify-center items-center snap-start">
          <ParticlesComponent />
          <div className="mb-5 w-2/5 flex flex-row items-center justify-center">
            <div className="flex flex-col items-center justify-around">
              <TypewriterText text="Hello;" speed={100} delay={1000} className="text-9xl font-black" /> 
              <TypewriterText text="I am Takuya Shinozaki!! I like making things!" speed={100} delay={3000} className="text-3xl mt-5 italic" /> 
            </div>
          </div>
          <div className="w-1/2">
            <div className="w-full relative h-[80vh] m-auto">
              <FloatThreeDModel />
            </div>
          </div>
          <ScrollDown animStatus="isInScreen" cursor="cursor-pointer" scrollClass="scroll-anim scroll-green" />
        </div>
        <div className="min-h-[80vh] relative snap-start w-3/4 mx-auto pt-[5vh]" >
          <DelayScrollAnimation>
            <div className="h-full flex flex-row">
              <div className="flex-col flex w-1/2">
                <p className="w-full">SITE DESIGN / GRAPHIC DESIGN / CODING - HTML, CSS, JAVASCRIPT, PHP, PYTHON / LIBRARIES AND FRAMEWORKS - REACT, REACT NATIVE, NEXTJS, WORDPRESS / CONSULTING</p>
                <h2 className="text-6xl font-bold mt-[15vh]"> 
                  <span ref={refOrange} className={isInViewOrange ? "highlighter-orange inline-block" : "inline-block"}>
                    <span>WEB DESIGN</span>
                    </span>
                </h2>
                {/* <h2 className="text text-6xl font-bold mt-5">
                <span ref={refBlack} className={isInViewBlack ? "highlighter-black" : ""}>
                  <span className="text-original">CODING</span>
                  <span className="text-clone">CODING</span>
                </span>
                </h2> */}
                <h2 className="text-6xl font-bold mt-5">
                <span className={isInViewBlack ? "inline-block highlighter-black": "inline-block"} ref={refBlack} data-txt="CODING">
                CODING
              </span>
                </h2>
              </div>
              <div className="absolute right-[10vh] top-[12vh] w-1/3 max-h-[80vh] overflow-hidden text-ellipsis whitespace-nowrap">
                <TextMultilineOverflow className="min-h-[50vh] max-h-[50vh] text-lg leading-loose">フリーランスのウェブデベロッパーです。<br />お客様から寄せられたイメージをもとに、ウェブサイトやスマホアプリのデザイン設計や、開発を行います。<br />何よりお客様が伝えたいメッセージをユーザーにお届けすることに重きをおいています。原則サイトはスマートフォンなどモバイル端末に対応するレスポンシブウェブデザインにて設計します。<br />見た目だけでなく将来性やお客様の使い勝手を考え、サイトの更新・メンテナンス等も簡単に行えるよう配慮いたします。それもあり、お客様には開発の過程で、取りうるオプションの提示、そしてご判断をして頂く機会を設けていただくこともありますが、その際にはその選択肢のメリット・デメリットをできるだけわかりやすく説明させていただきます。<br/>過去の制作物は、アットホームなデザインのもの、スタイリッシュなものと様々なデザインがございますが、いずれもお客様の意図を理解しようと努力し、閲覧者に納得していただけるものを目指した結果です。<br/>これまでご依頼いただいていますお客様にはショップオーナー様、企業のホームページ担当者様、ウェブ制作会社様など様々ですが、いずれも真摯にかつ柔軟に対応しています。ウェブサイトに関することはお気軽にご相談ください。<br/> 篠崎&nbsp;拓也</TextMultilineOverflow>
              </div>
              <HeaderCard className="w-1/3 absolute -top-[5vh] right-[10vh]" engTitle="About" jpTitle="自己紹介" orientation="landscape" />
            </div>
          </DelayScrollAnimation>
        </div>
        <div className="min-h-[80vh] relative snap-start pt-[5vh]" >
          <DelayScrollAnimation>
            <div className="mx-auto relative w-3/4 flex flex-row justify-around items-center my-auto">
              <HeaderCard className="h-5/6 absolute -top-[4vh] -left-[11vh]" engTitle="Works" jpTitle="制作物" orientation="portrait" />
              <Carousel images={[{src:"/images/diamond_in_the_rough/diamond_in_the_rough_top_portrait.png", href:""},{src:"/images/jp-class/jp-class-top-portrait.png", href:""},{src:"/images/terakoya/terakoya-top-portrait.png", href:""}]}/>
            </div>
          </DelayScrollAnimation>
        </div>
      </Layout>
    </div>
  );
}
