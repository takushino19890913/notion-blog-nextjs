import React, { FC, useEffect, useRef, useState } from "react";

/**
 * This is the button for header - I made this button inspired by the following website
 * https://hasegawahiroshi.jp/
 * @param orientation - set the button or landscape button
 * @param engTitle - English title of the header
 * @param jpTitle - Japanese title of the header
 * @param className - apply class
 */
type HeaderCardProps = {
   orientation: "landscape" | "portrait"
   engTitle: string
   jpTitle: string
   className?: string
}

const HeaderCard:FC<HeaderCardProps> = ({orientation, engTitle, jpTitle, className})=>  {
    const [orientationClass, setOrientationClass] = useState(orientation == "portrait" ? "vertical-rl-all":"")
    return(<span className={orientationClass + " flex flex-row cursor-pointer font-bold justify-between p-5 border border-4 border-black items-center z-50 hover:bg-[#FCF2DC] " + className}>
            <h2 className="text-5xl">{engTitle}</h2>
            <p>{jpTitle}</p>
    </span>)
}

export default HeaderCard;