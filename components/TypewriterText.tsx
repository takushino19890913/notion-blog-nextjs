// components/TypewriterText.js
import { useState, useEffect } from 'react'

export default function TypewriterText({ text, speed, delay, className }) {
  const [index, setIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false) // Add this line
  const [typewriterClass, setTypewriterClass] = useState<string>(
    'typewriter' + ' ' + 'typewriterBlink'
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStarted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isStarted) {
      return
    }

    const timer = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex >= text.length) {
          setIsFinished(true) // Add this line
          return prevIndex
        }

        return prevIndex + 1
      })
    }, speed)

    setTypewriterClass('typewriter')
    return () => clearInterval(timer)
  }, [isStarted, speed, text.length]) // Add `text.length` to the dependency array

  useEffect(() => {
    if (isFinished) {
      setTypewriterClass('typewriter' + ' ' + 'typewriterBlink')
      setTimeout(() => {
        setTypewriterClass('border-none')
      }, 2000)
    }
  }, [isFinished])

  // テキストが表示される前でもスペースを確保するための透明なプレースホルダー
  const placeholderText = isStarted
    ? index == 0
      ? '　'.repeat(text.length)
      : text.slice(0, index)
    : '　'.repeat(text.length)

  return (
    <div
      className={typewriterClass + ' ' + className}
      style={{ opacity: isStarted ? 100 : 0 }}
    >
      {placeholderText}
    </div>
  )
}
