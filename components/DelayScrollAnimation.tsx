import React, { useEffect, useRef, useState } from "react";

type DelayedScrollAnimationProps = {
  children: React.ReactNode;
  className?: string;
};

const DelayedScrollAnimation: React.FC<DelayedScrollAnimationProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<Array<boolean>>([]);
  const [snapContainer, setSnapContainer] = useState<HTMLElement>()

  useEffect(() => {
    setSnapContainer(document.getElementById('snapContainer'))
    const checkVisibility = () => {
      if (ref.current) {
        setIsVisible(prevVisible => Array.from(ref.current.children).map((child, index) => {
          if (prevVisible[index]) return true; // if it's already true, keep it true
    
          const rect = child.getBoundingClientRect();
          return rect.top <= window.innerHeight && rect.bottom >= 0;
        }));
      }
    };

    checkVisibility(); // initial check
    if(snapContainer){
      snapContainer.addEventListener("scroll", checkVisibility);
      return () => {
        snapContainer.removeEventListener("scroll", checkVisibility);
      };
    }
  }, [snapContainer]);

  return (
    <div className={"delayScroll " + className} ref={ref}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement, {
          style: {
            opacity: isVisible[index] ? 1 : 0,
            transform: isVisible[index] ? 'translate3d(0, 0, 0) skewY(0)' : 'translate3d(0, 100%, 0) skewY(12deg)',
            transition: `opacity 0.5s ${0.05 * index}s, transform 0.5s ${0.05 * index}s`,
          }
        })
      )}
    </div>
  );
};

export default DelayedScrollAnimation;
