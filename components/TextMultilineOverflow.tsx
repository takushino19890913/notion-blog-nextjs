import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface TextMultilineOverflowProps {
  children: ReactNode;
  className: string;
}

const TextMultilineOverflow: React.FC<TextMultilineOverflowProps> = ({ children, className }) => {
  const [pages, setPages] = useState<ReactNode[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const textRef = useRef<HTMLParagraphElement>(null);
  const widthCache = useRef<Map<string, number>>(new Map());
  const [transition, setTransition] = useState<'none' | 'left' | 'right'>('none');

  useEffect(() => {
    if (transition !== 'none') {
      const timer = setTimeout(() => {
        setTransition('none');
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [transition]);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setTransition('right');
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
      },300)
    }
  };
  
  const handlePrev = () => {
    if (currentPage > 0) {
      setTransition('left');
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
      },300)
    }
  };
  
  const recalculateText = () => {
    const selector = textRef.current;
    if (!selector) return;

    const style = window.getComputedStyle(selector);
    const width = parseFloat(style.width);
    const lineHeight = parseFloat(style.lineHeight);
    const maxRows = Math.floor(parseFloat(style.height) / lineHeight);
    let currentWidth = 0;
    let currentRows = 1;
    let currentContent: ReactNode = '';
    let allPages: ReactNode[] = [];

    const measureTextWidth = (text: string) => {
      if (widthCache.current.has(text)) {
        return widthCache.current.get(text)!;
      }

      const span = document.createElement('span');
      span.style.font = style.font;
      span.textContent = text;
      document.body.appendChild(span);
      const textWidth = span.getBoundingClientRect().width;
      span.remove();

      widthCache.current.set(text, textWidth);
      return textWidth;
    };

    React.Children.forEach(children, child => {
      if (typeof child === 'string') {
        const words = child.split(' ');
        for (let word of words) {
          const wordWidth = measureTextWidth(word);
          if (currentWidth + wordWidth < width && currentRows <= maxRows) {
            currentContent += word + ' ';
            currentWidth += wordWidth;
          } else {
            if (currentRows < maxRows) {
              currentRows++;
              currentWidth = wordWidth;
              currentContent += word + ' ';
            } else {
              allPages.push(currentContent);
              currentContent = word + ' ';
              currentRows = 1;
              currentWidth = wordWidth;
            }
          }
        }
      } else if (React.isValidElement(child) && child.type === 'br') {
        if (currentRows >= maxRows) {
          allPages.push(currentContent);
          currentContent = '';
          currentRows = 1;
          currentWidth = 0;
        } else {
          currentRows++;
          currentContent += '\n';
          currentWidth = 0;
        }
      }

    });

    if (currentContent !== '') {
      allPages.push(currentContent);
    }

    setPages(allPages);
};

useEffect(() => {
  recalculateText();
}, [children, className]);

useEffect(() => {
  const handleResize = () => {
    recalculateText();
  };
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, [children, className]);

useEffect(() => {
  console.log(pages);
}, [pages])

return (
  <div style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', transform: transition === 'left' ? 'translateX(0)' : transition === 'right' ? 'translateX(-200%)' : 'translateX(-100%)', transition: transition==='none' ? '':'transform 0.3s' }}>
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
    <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0 }}>
      {currentPage !== 0 && (
        <button 
          style={{ background: 'rgba(0, 0, 0, 0.3)', color: 'white', border: 'none', borderRadius: '50%', padding: '8px 12px', cursor: 'pointer' }} 
          onClick={handlePrev}
        >
          ◀️
        </button>
      )}
    </div>
    <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 0 }}>
      {currentPage !== pages.length - 1 && (
        <button 
          style={{ background: 'rgba(0, 0, 0, 0.3)', color: 'white', border: 'none', borderRadius: '50%', padding: '8px 12px', cursor: 'pointer' }} 
          onClick={handleNext}
        >
          ▶️
        </button>
      )}
    </div>
  </div>
);
}

export default TextMultilineOverflow;