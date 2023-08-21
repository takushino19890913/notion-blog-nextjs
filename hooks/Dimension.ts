import { useState, useEffect } from 'react'

function getWindowDimensions() {
  if (typeof window !== 'undefined') {
    const { innerWidth: width, innerHeight: height } = window
    const mobile_w = document.documentElement.clientWidth
    const mobile_h = document.documentElement.clientHeight
    const w = Math.max(width, mobile_w)
    const h = Math.max(height, mobile_h)
    return {
      w,
      h,
    }
  }
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions())
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowDimensions
}
