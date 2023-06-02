import React, { useState, createContext, useContext } from 'react';

const useImageLoadingContext = (): ImageLoadingContextType => {
    const context = useContext(ImageLoadingContext);
    if (!('loadingImages' in context) || !('setLoadingImages' in context)) {
      throw new Error('useImageLoadingContext must be used within an ImageLoadingProvider');
    }
    return context as ImageLoadingContextType;
  };
  

interface ImageLoadingContextType {
    loadingImages: number;
    setLoadingImages: React.Dispatch<React.SetStateAction<number>>;
  }

const ImageLoadingContext = createContext<ImageLoadingContextType | {}>({});

const ImageLoadingProvider = ({ children }) => {
  const [loadingImages, setLoadingImages] = useState(0);

  return (
    <ImageLoadingContext.Provider value={{ loadingImages, setLoadingImages }}>
      {children}
    </ImageLoadingContext.Provider>
  );
};

export { ImageLoadingContext, ImageLoadingProvider, useImageLoadingContext };
