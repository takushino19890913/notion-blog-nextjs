import Layout from '../components/Layout'
import Image from 'next/image'

export default function About() {
  return (
    <div className="flex flex-col relative">
      <Layout>
        <div className="font-reitam relative h-[80vh] leading-loose tracking-[0.3em] md:tracking-[0.8em] xl:tracking-[1.0em] pb-[10vh] flex flex-col justify-center items-center">
          <h1 className="text-center text-lg md:text-5xl xl:text-6xl font-bold">
            Thoughts in the Rough
          </h1>
          <p className="text-center mt-5 font-bold hidden md:block md:text-xl xl:text-3xl font-bebas">
            This is a place to share my works and ideas..
          </p>
        </div>
        <div className="w-5/6 md:w-2/3 mx-auto flex flex-col md:flex-row justify-between tracking-[.25em]">
          <div className="flex flex-col ">
            <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold">
              Developer
            </h2>
            <h1 className="text-3xl md:text-6xl xl:text-8xl font-bold">
              Motokusa
            </h1>
          </div>
          <div className="my-3 md:my-0 border-t-2 md:border-t-none md:border-l-2 border-[#9C9C9B]"></div>
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
          <p>
            1989年生まれ、Webデベロッパー、Motokusaと申します。
            <br />
            <br />
            私はNext.js、React、TypeScriptを用いたフロントエンド開発を得意としつつ、バックエンドやインフラ構築の知識も活かし、ユーザー目線に立った使いやすく高品質なプロダクトを開発することを心がけています。クライアントの皆様とのコミュニケーションを大切にし、要望を正確に理解して柔軟に対応できるよう努めております。
            <br />
            <br />
            Webサイトの開発に限らず、クライアントの皆様の業務効率化のお手伝いできます。VBAやPythonを用いて、繰り返しの作業を自動化したり、大量のデータを瞬時に処理したりすることで、作業時間を大幅に短縮することができます。例えば、毎月の経費精算や在庫管理、顧客データの集計など、手作業では時間がかかる業務を自動化することで、クライアントの皆様により多くの時間を創造的な活動に充てていただけるようサポートいたします。
            <br />
            <br />
            プロジェクトの進行は、小さな機能ごとに開発とテストを繰り返しながら、クライアントの皆様からのフィードバックを随時取り入れていきます。これにより、クライアントの皆様のニーズに柔軟に対応しつつ、リスクを最小限に抑えながら高品質なプロダクトを開発することができます。
            <br />
            <br />
            Webサイトの開発においては、見た目の美しさだけでなく、将来的な拡張性やメンテナンス性、そしてユーザーの使い勝手にも細心の注意を払っています。コードの品質を高く保ち、分かりやすい構造で設計することで、将来の機能追加や変更にも柔軟に対応できるようにしています。さらに、クライアントの皆様にも運用しやすいよう、サイトの管理画面や更新方法についても丁寧にご説明いたします。
            <br />
            <br />
            プロジェクトを進める上では、様々な判断が必要になることがあります。その際は、各選択肢のメリットとデメリット、そしてリスクについても分かりやすくご説明した上で、クライアントの皆様にご判断いただくようにしています。私自身の知識と経験を活かしつつ、クライアントの皆様の意思を最大限尊重することを心がけています。
            <br />
            <br />
            プライベートでは、生成AIを用いたWebアプリや、モバイルゲームの開発など、新しい技術を用いたクリエイティブなプロジェクトにも積極的に取り組んでいます。技術の可能性を探求し、自ら手を動かして創造することに喜びを感じています。
            <br />
            <br />
            皆様と共に、価値あるプロダクトを生み出していくことを楽しみにしております。お気軽にご相談ください。
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
