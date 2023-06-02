
import React, { FC, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark, atomDark,vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

/**
 * Codeblock Componentは、react-syntax-highlighterとreact-copy-to-clipboard モジュールを使って実装した。
 * @param codeString - codeの内容
 * @param codeLanguage - codeの使用言語
 * @returns 
 */

interface Props  {
    codeString: string
    codeLanguage: string
}
const CodeBlock:FC<Props> = ({codeString, codeLanguage }) => {

    const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };


    return (
        <div className="code-block-wrapper">
          <div className="flex flex-row justify-between">
          <div className="inline-block rounded-t-md bg-[#1E1E1E] text-white py-1 px-3 text-xs">{codeLanguage}</div>
          <CopyToClipboard  text={codeString} onCopy={handleCopy}>
            <button className="inline-block rounded-t-md bg-[#1E1E1E] text-white py-1 px-3 text-xs">{isCopied ? "Copied" : "Copy"}</button>
          </CopyToClipboard>
          </div>
          <SyntaxHighlighter language={codeLanguage} style={vscDarkPlus}>
            {codeString}
          </SyntaxHighlighter>
        </div>
    )
  };
  
export default CodeBlock;