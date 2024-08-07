import { useEffect, useRef, useState } from 'react'

export default function useWindow() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const [offset, setOffset] = useState({
    x: window.scrollX,
    y: window.scrollY
  })

  const [isHidden, setIsHidden] = useState<boolean>(false)

  // Saving last scroll position
  const lastScrollTop = useRef(0)

  const handleResize = () => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
  }

  const handleScroll = () => {
    setOffset({
      x: window.scrollX,
      y: window.scrollY
    })

    setIsHidden(window.scrollY > lastScrollTop.current)
    lastScrollTop.current = window.scrollY
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return {
    /**
     * Get width or height of window when dimension change
     */
    windowDimensions,
    /**
     * Get width of window
     */
    width: windowDimensions.width,
    /**
     * Get width of height
     */
    height: windowDimensions.height,
    /**
     * Get scroll offset x or y
     */
    offset,
    /**
     * Get scroll offset x
     */
    offsetX: offset.x,
    /**
     * Get scroll offset y
     */
    offsetY: offset.y,
    /**
     * Read status hidden for Header component
     */
    hidden: isHidden
  }
}
