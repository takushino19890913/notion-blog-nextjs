import React, { useEffect, useRef, useState, ReactNode } from 'react'
import { useMediaQuery } from '@mui/material'
import { useSwipeable } from 'react-swipeable'

interface TextMultilineOverflowProps {
  children: ReactNode
  className: string
}

const TextMultilineOverflow: React.FC<TextMultilineOverflowProps> = ({
  children,
  className,
}) => {
  const [pages, setPages] = useState<ReactNode[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const textRef = useRef<HTMLParagraphElement>(null)
  const widthCache = useRef<Map<string, number>>(new Map())
  const [transition, setTransition] = useState<'none' | 'left' | 'right'>(
    'none'
  )

  useEffect(() => {
    if (transition !== 'none') {
      const timer = setTimeout(() => {
        setTransition('none')
      }, 300)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [transition])

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setTransition('right')
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1)
      }, 300)
    }
  }

  const handlePrev = () => {
    if (currentPage > 0) {
      setTransition('left')
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1)
      }, 300)
    }
  }

  const recalculateText = () => {
    console.log('recalculateText')
    const selector = textRef.current
    if (!selector) return

    const style = window.getComputedStyle(selector)
    const width = parseFloat(style.width)
    const lineHeight = parseFloat(style.lineHeight)
    const maxRows = Math.floor(parseFloat(style.height) / lineHeight)
    let currentWidth = 0
    let currentRows = 1
    let currentContent: ReactNode = ''
    let allPages: ReactNode[] = []

    const measureTextWidth = (text: string) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (context) {
        context.font = style.font
        const metrics = context.measureText(text)
        return metrics.width
      }
      return 0
    }

    const isEnglish = (text: string) => {
      return /^[a-zA-Z0-9\s.,!?]+$/.test(text)
    }

    React.Children.forEach(children, (child) => {
      if (typeof child === 'string') {
        if (isEnglish(child)) {
          const words = child.match(/\S+|\s+/g) || []
          for (let word of words) {
            const wordWidth = measureTextWidth(word)
            if (currentWidth + wordWidth <= width) {
              currentContent += word
              currentWidth += wordWidth
            } else {
              if (currentRows < maxRows) {
                currentRows++
                currentContent += '\n' + word
                currentWidth = wordWidth
              } else {
                allPages.push(currentContent)
                currentContent = word
                currentRows = 1
                currentWidth = wordWidth
              }
            }
          }
        } else {
          const characters = Array.from(child)
          for (let char of characters) {
            const charWidth = measureTextWidth(char)
            if (currentWidth + charWidth <= width) {
              currentContent += char
              currentWidth += charWidth
            } else {
              if (currentRows < maxRows) {
                currentRows++
                currentContent += '\n' + char
                currentWidth = charWidth
              } else {
                allPages.push(currentContent)
                currentContent = char
                currentRows = 1
                currentWidth = charWidth
              }
            }
          }
        }
      } else if (React.isValidElement(child) && child.type === 'br') {
        if (!(currentRows === 1 && currentContent === '')) {
          currentContent += '\n'
          currentWidth = 0
          currentRows++
          if (currentRows > maxRows) {
            allPages.push(currentContent)
            currentContent = ''
            currentRows = 1
          }
        }
      }
    })

    if (currentContent !== '') {
      allPages.push(currentContent)
    }

    setPages(allPages)
  }

  useEffect(() => {
    recalculateText()
  }, [children, className])

  useEffect(() => {
    const handleResize = () => {
      recalculateText()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [children, className])

  useEffect(() => {
    console.log(pages[0])
  }, [pages])

  const isMobile = useMediaQuery('(max-width:640px)')

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
  })

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          transform:
            transition === 'left'
              ? 'translateX(0)'
              : transition === 'right'
              ? 'translateX(-200%)'
              : 'translateX(-100%)',
          transition: transition === 'none' ? '' : 'transform 0.3s',
        }}
        {...(isMobile ? swipeHandlers : {})}
      >
        <p
          className={`whitespace-pre-wrap ${className}`}
          style={{ flex: 'none', width: '100%' }}
        >
          {pages[currentPage - 1]}
        </p>
        <p
          ref={textRef}
          className={`whitespace-pre-wrap ${className}`}
          style={{ flex: 'none', width: '100%' }}
        >
          {pages[currentPage]}
        </p>
        <p
          className={`whitespace-pre-wrap ${className}`}
          style={{ flex: 'none', width: '100%' }}
        >
          {pages[currentPage + 1]}
        </p>
      </div>
      {!isMobile && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              left: 0,
            }}
          >
            {currentPage !== 0 && (
              <button
                style={{
                  background: 'rgba(0, 0, 0, 0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
                onClick={handlePrev}
              >
                ◀️
              </button>
            )}
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: 0,
            }}
          >
            {currentPage !== pages.length - 1 && (
              <button
                style={{
                  background: 'rgba(0, 0, 0, 0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
                onClick={handleNext}
              >
                ▶️
              </button>
            )}
          </div>
        </>
      )}
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}
      >
        {pages.map((_, index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor:
                index === currentPage
                  ? 'rgba(0, 0, 0, 0.8)'
                  : 'rgba(0, 0, 0, 0.3)',
              margin: '0 4px',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TextMultilineOverflow
