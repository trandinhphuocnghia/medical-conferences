'use client'

import { useState, useEffect } from 'react'

export function TypewriterTitle() {
  const line1 = 'LIVE ROBOTIC'
  const line2 = 'GASTRECTOMY WORKSHOP'

  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [typingLine, setTypingLine] = useState(1)

  useEffect(() => {
    if (typingLine === 1) {
      if (text1.length < line1.length) {
        const timeout = setTimeout(() => {
          setText1(line1.slice(0, text1.length + 1))
        }, 80) // Typing speed
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setTypingLine(2)
        }, 300) // Pause between lines
        return () => clearTimeout(timeout)
      }
    } else if (typingLine === 2) {
      if (text2.length < line2.length) {
        const timeout = setTimeout(() => {
          setText2(line2.slice(0, text2.length + 1))
        }, 80)
        return () => clearTimeout(timeout)
      }
    }
  }, [text1, text2, typingLine])

  return (
    <h1 className="mb-6 relative text-4xl font-black leading-none text-cyan sm:text-5xl lg:text-6xl tracking-tighter min-h-[80px] sm:min-h-[96px] lg:min-h-[120px]">
      <div className="absolute left-1/2 top-1/2 lg:left-[20%] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 lg:h-96 lg:w-96 stomach-glow animate-pulse" />
      
      {/* Line 1 */}
      <span>
        {text1}
        {typingLine === 1 && (
          <span
            className="inline-block w-[0.1em] h-[0.8em] bg-cyan animate-pulse align-middle ml-1 -mt-2"
            style={{ animationDuration: '0.8s' }}
          />
        )}
      </span>
      <br />
      
      {/* Line 2 */}
      <span className="text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
        {text2}
        {typingLine === 2 && (text2.length > 0 || typingLine === 2) && (
          <span
            className="inline-block w-[0.1em] h-[0.8em] bg-white animate-pulse align-middle ml-1 -mt-2 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ animationDuration: '0.8s' }}
          />
        )}
      </span>
    </h1>
  )
}
