import { TwitterTweetEmbed } from "react-twitter-embed";

/**
 * text内にツイッターURLが含まれているかどうかを判定する
 * @param text
 * @returns
 */
export const hasTwitterUrl = (text: string) => {
    const regexpTweet = /(https?:\/\/twitter\.com\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+\/status\/[0-9]+)/g;
    const tweet = text.match(regexpTweet);
    return Boolean(tweet?.length);
  };
  /**
 * テキスト内のツイッターURLからツイッターのEmbedコンポーネントを生成する
 * @param text
 * @returns
 */

export type EmbedTwitterProps = {
    text: string;
  };
  export const EmbedTwitter: React.FC<EmbedTwitterProps> = (props) => {
    const regexpTweet = /(https?:\/\/twitter\.com\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+\/status\/[0-9]+)/g;
    const tweet = props.text.match(regexpTweet);
  
    if (tweet) {
      return <TwitterTweetEmbed tweetId={tweet[0].split("/")[5]} />;
    }
    return <></>;
  };
  