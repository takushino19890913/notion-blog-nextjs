import React, { useState, useEffect } from 'react';
import Loader from './Loader';

interface FullPageLoaderProps {
  children: React.ReactNode;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const handleDOMContentLoaded = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2秒間遅延させます
    };
  
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2秒間遅延させます
    } else {
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    }
  
    return () => {
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    };
  }, []);
  

  return (
    <>
      {isLoading ? (
        <div className="full-page-loader">
          <Loader />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default FullPageLoader;
