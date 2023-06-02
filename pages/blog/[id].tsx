import { Fragment, useState } from "react";
import Head from "next/head";
import { getDatabase, getPage, getBlocks } from "../../lib/notion";
import Link from "next/link";
import { databaseId } from "../index";
import styles from "../post.module.css";
import { hasTwitterUrl, EmbedTwitter } from "../../lib/embed";
import axios from 'axios';
import MetaCard from "../../components/Metacard";
import { load } from 'cheerio';
import CodeBlock from "../../components/CodeBlock";
import Layout from "../../components/Layout";

const fetchMetaData = async (url) => {
  try {
    const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const $ = load(response.data.contents);
    const title = $('head > title').text() || null;
    const description = $('head > meta[name="description"]').attr('content') != undefined ? $('head > meta[name="description"]').attr('content') :
    $('head > meta[property="og:description"]').attr('content')  != undefined ? $('head > meta[property="og:description"]').attr('content') : null;
    const image = $('head > meta[property="og:image"]').attr('content') || null;
    
    return {
      title,
      description,
      image
    };
  } catch (error) {
    console.error('Failed to fetch meta data:', error);
    return null;
  }
};




export const Text = ({ text }) => {
  if (!text) {
    return null;
  }
  return text.map((value) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;
    return (
      <span
        className={[
          bold ? styles.bold : "",
          code ? styles.code : "",
          italic ? styles.italic : "",
          strikethrough ? styles.strikethrough : "",
          underline ? styles.underline : "",
        ].join(" ")}
        style={color !== "default" ? { color } : {}}
        key={text.content}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
};

const renderNestedList = (block) => {
  const { type } = block;
  const value = block[type];
  if (!value) return null;

  const isNumberedList = value.children[0].type === "numbered_list_item";

  if (isNumberedList) {
    return <ol>{value.children.map((block) => renderBlock(block))}</ol>;
  }
  return <ul>{value.children.map((block) => renderBlock(block))}</ul>;
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      if(value.rich_text.length){
        return (
          <p>
            <Text text={value.rich_text} />
          </p>
        );
      }
      else{
        <br></br>
      }
    case "heading_1":
      if(value.rich_text.length){
      return (
        <h1>
          <Text text={value.rich_text} />
        </h1>
      );
      }else{
        return <br></br>
      }
    case "heading_2":
      return (
        <h2>
          <Text text={value.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3>
          <Text text={value.rich_text} />
        </h3>
      );
    case "bulleted_list": {
      return <ul>{value.children.map((child) => renderBlock(child))}</ul>;
    }
    case "numbered_list": {
      return <ol>{value.children.map((child) => renderBlock(child))}</ol>;
    }
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li className="list-disc" key={block.id}>
          <Text text={value.rich_text} />
          {!!value.children && renderNestedList(block)}
        </li>
      );
    case "to_do":
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
            <Text text={value.rich_text} />
          </label>
        </div>
      );
    case "toggle":
      return (
        <details>
          <summary>
            <Text text={value.rich_text} />
          </summary>
          {block.children?.map((child) => (
            <Fragment key={child.id}>{renderBlock(child)}</Fragment>
          ))}
        </details>
      );
    case "child_page":
      return (
        <div className="border-[1px] border-solid p-[20px] rounded-[12px]">
          <strong>{value.title}</strong>
          {block.children.map((child) => renderBlock(child))}
        </div>
      );
    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr key={id} />;
    case "quote":
      return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
    case "code":
      console.log(value.language)
      
      //rich_text[0].language
      return (
        <CodeBlock codeLanguage={value.language} codeString={value.rich_text[0].text.content}/>
      );
    case "file":
      const src_file =
        value.type === "external" ? value.external.url : value.file.url;
      const splitSourceArray = src_file.split("/");
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const caption_file = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <div className={styles.file}>
            📎{" "}
            <Link href={src_file} passHref>
              {lastElementInArray.split("?")[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      );
      case "bookmark":
        const href = block.bookmark.url;
        return (
          <MetaCard url={href} metaData={block.metaData} />
        );
    case "table": {
      return (
        <table className={styles.table}>
          <tbody>
            {block.children?.map((child, i) => {
              const RowElement =
                value.has_column_header && i == 0 ? "th" : "td";
              return (
                <tr key={child.id}>
                  {child.table_row?.cells?.map((cell, i) => {
                    return (
                      <RowElement key={`${cell.plain_text}-${i}`}>
                        <Text text={cell} />
                      </RowElement>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    case "column_list": {
      return (
        <div className={styles.row}>
          {block.children.map((block) => renderBlock(block))}
        </div>
      );
    }
    case "column": {
      return <div>{block.children.map((child) => renderBlock(child))}</div>;
    }
    case "video": 
    {
      let youtubeId = value.external.url.split("v=")[1];
      return(<iframe width="420" height="315"
      src={`https://www.youtube.com/embed/${youtubeId}`}>
      </iframe>)
    }
    case "embed":
      {
        if(hasTwitterUrl(value.url)){
          return(
            <EmbedTwitter text={value.url} />
          )
        }
      }
    default:
      return `❌ Unsupported block (${
        type === "unsupported" ? "unsupported by Notion API" : type
      })`;
  }
};

export default function Post({ page, blocks }) {
  if (!page || !blocks) {
    return <div />;
  }
 
  return (
    <div>
      <Head>
        <title>{page.properties.Name.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <article className="px-[20px] mx-auto whitespace-pre-line" style={{maxWidth:"700px", lineHeight:"1.5"}}>
          <h1 className="my-10 text-[36px]">
            <Text text={page.properties.Name.title} />
          </h1>
          <section>
            {blocks.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
            <Link href="/blog" className="inline-block my-[20px]">
              ← Go back
            </Link>
          </section>
        </article>
      </Layout>
    </div>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId);
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const page = await getPage(id);
  const blocks = await getBlocks(id);

  // ブックマークのメタデータを取得する
  const blocksWithMetaData = await Promise.all(blocks.map(async (block) => {
    if (block.type === 'bookmark') {
      const metaData = await fetchMetaData(block.bookmark.url);
      return {
        ...block,
        metaData,
      };
    } else {
      return block;
    }
  }));

  return {
    props: {
      page,
      blocks: blocksWithMetaData,
    },
    revalidate: 1,
  };
};

