import { useEffect, useState, FC } from 'react'
import useWindowDimensions from '../hooks/Dimension'

interface Props {
  animStatus: 'isInScreen' | ''
  cursor: 'cursor-pointer' | 'pointer-events-none' | ''
  scrollClass: 'scroll-anim scroll-green' | 'scroll-anim scroll-white'
}

export const ScrollDown: FC<Props> = ({ animStatus, cursor, scrollClass }) => {
  const [height, setHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)

  if (typeof window !== 'undefined') {
    let { h, w } = useWindowDimensions()
    //componentDidMount
    useEffect(() => {
      setHeight(h)
      setWidth(w)
    }, [w, h])
  }

  const scroll = () => {
    const snapContainer = document.getElementById('snapContainer')
    let i = 0
    snapContainer.classList.remove('snap-y', 'snap-mandatory')
    const scrollInterval = setInterval(() => {
      if (i < 50) {
        snapContainer.scrollBy(0, (height * 85) / 100 / 50)
        i++
      } else {
        clearInterval(scrollInterval)
        snapContainer.classList.add('snap-y', 'snap-mandatory')
      }
    }, 4)
  }

  return (
    <p
      className={`opacity-0 z-20 ${animStatus} ${scrollClass} hidden md:block `}
    >
      <a className={cursor + ' text-sm italic'} onClick={scroll}>
        Scroll
      </a>
    </p>
  )
}
