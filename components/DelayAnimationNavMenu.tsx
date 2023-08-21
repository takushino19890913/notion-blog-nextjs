import React, { useEffect, useRef, useState } from "react";

type DelayedAnimationNavMenuProps = {
  children: React.ReactNode;
  className?: string;
  menuOpenTime: number;
  delayTime?: number;
  delayMultiply?: number
  menuOpen: boolean
};

const DelayedAnimationNavMenu: React.FC<DelayedAnimationNavMenuProps> = ({ children, className, menuOpenTime, delayTime, delayMultiply, menuOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<Array<boolean>>([]);


  useEffect(() => {
    if(menuOpen){
      const checkVisibility = () => {
        if (ref.current) {
          const visibleArray: Array<boolean> = Array.from(ref.current.children).map((child) => {
            const rect = child.getBoundingClientRect();
            return rect.top <= window.innerHeight && rect.bottom >= 0;
          });
          setIsVisible(visibleArray);
        }
      };
    
      const delay = Date.now() - menuOpenTime;
      const delayedCheck = setTimeout(checkVisibility, Math.max(0, delayTime - delay));
    
      return () => {
        clearTimeout(delayedCheck);
      };
    } else{
      if (ref.current) {
        setIsVisible(Array.from(ref.current.children).map(() => menuOpen));
      }
    }
  }, [menuOpenTime,menuOpen]);

  return (
    <div className={`delayScroll ${className}`} ref={ref}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement, {
          style: {
            opacity: isVisible[index] ? 1 : 0,
            transform: isVisible[index] ? (menuOpen ? 'translate3d(0, 0, 0) skewY(0)' : 'translate3d(0, 100%, 0) skewY(12deg)') : (menuOpen ? 'translate3d(0, 100%, 0) skewY(12deg)' : 'translate3d(0, 50%, 0) skewY(0)'),
            transition: menuOpen ? `opacity 0.5s ${delayMultiply * index}s, transform 0.5s ${delayMultiply * index}s` : `opacity 0.5s  ${delayMultiply * index}s, transform 0.5s ${delayMultiply * index}s`,
          }
        })
      )}
    </div>
  );
};

export default DelayedAnimationNavMenu;
