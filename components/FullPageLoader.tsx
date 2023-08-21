import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import { CSSTransition } from 'react-transition-group';
import Wave from 'react-wavify';

interface FullPageLoaderProps {
  children: React.ReactNode;
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  waveTransit: boolean
  setWaveTransit: React.Dispatch<React.SetStateAction<boolean>>
  isTransitioning?:boolean
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ children, isLoading,setIsLoading, waveTransit, setWaveTransit, isTransitioning }) => {
  const [isLoadingEnd, setIsLoadingEnd] = useState(true);
  
  useEffect(() => {
    if(!isTransitioning){
      const handleDOMContentLoaded = () => {
        setTimeout(() => {
          setWaveTransit(true);
          setIsLoadingEnd(false);
        }, 1000)
        setTimeout(() => {
          setIsLoading(false);
          setWaveTransit(false);
          setIsLoadingEnd(true)
        }, 2000); // 2秒間遅延させます
      };
    
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => {
          setWaveTransit(true);
          setIsLoadingEnd(false);
        }, 1000)
        setTimeout(() => {
          setIsLoading(false);
          setWaveTransit(false);
          setIsLoadingEnd(true)
        }, 2000); // 2秒間遅延させます
      } else {
        document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
      }
    
      return () => {
        document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      };
    }
  }, []);
  
  useEffect(() => {

  }, [waveTransit, isLoading])

  return (
    <>
      {isLoading ? (
        <div className="full-page-loader">
              <CSSTransition
                  in={waveTransit}
                  timeout={1000}
                  classNames="wave-transform-reverse-after-loading"
                  unmountOnExit
                  onExited={() => {
                    
                  }}
              >
                {(state) => (
                  <Wave
                    fill="#002066"
                    paused={false}
                    options={{
                      height: 20,
                      amplitude:40,
                      speed: 0.15,
                      points: 3,
                    }}
                    style={{
                      position: "fixed",
                      top: -100,
                      left: 0,
                      width: "100%",
                      zIndex: 51,
                      transform: `scale(1, 1.4)`
                    }}
                  />

                )}
              </CSSTransition>
              <CSSTransition
                in={waveTransit}
                timeout={1000}
                classNames="wave-transform-after-loading"
                unmountOnExit
                onExited={() => {
                  
                }}
              >
                {(state) => (
                  <Wave
                    fill="#002066"
                    paused={false}
                    options={{
                      height: 20,
                      amplitude: 40,
                      speed: 0.15,
                      points: 3,
                    }}
                    style={{
                      position: "fixed",
                      top: -50,
                      left: 0,
                      width: "100%",
                      zIndex: 51,
                      transform: `scale(1, -1.4)`,
                    }}
                  />
                 )}
              </CSSTransition>
              <CSSTransition
                  in={isLoadingEnd}
                  timeout={1000}
                  classNames="loading-end"
                  unmountOnExit
                  onExited={() => {
                    
                  }}
              >
                <Loader />
              </CSSTransition>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default FullPageLoader;
