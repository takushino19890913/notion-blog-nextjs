import Head from "next/head";
import Layout from "../components/Layout";
import ThreeDModel from '../components/ThreeDModel';
import TypewriterText from '../components/TypewriterText';  // <- Add this line
import FloatThreeDModel from "../components/FloatThreeDModel";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home() {
  return (
  <div className="flex flex-col">
    <Head>
      <title>Thought in the rough</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
    <div className="relative h-[85vh] flex flex-row justify-center items-center">
      <div className="mb-5 w-2/5 flex flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-around">
        <TypewriterText text="Hello;" speed={100} delay={1000} className="text-9xl font-black" /> 
        <TypewriterText text="I am Takuya Shinozaki!! I like making things!" speed={100} delay={3000} className="text-3xl mt-5" /> 
        </div>
      </div>
      <div className="w-1/2">
        <div className="w-full relative h-[85vh] m-auto">
        <FloatThreeDModel />
        </div>
      </div>
    </div>
    </Layout>
  </div>
  );
}
