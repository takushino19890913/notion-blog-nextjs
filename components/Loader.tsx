import Image from 'next/image';
import Wave from 'react-wavify';
import { CSSTransition } from 'react-transition-group';
import { useState } from 'react';

const Loader = () => {


 
    return (
      <div className="loader flex flex-col justify-center items-center min-h-[100vh] bg-[#FCF2DC]">
        <div className="">
        <Image src="/images/diamond_in_the_rough_blue.png" width={250} height={250} alt={"loading img"}/>     
        </div> 
        <div className="animate-polishing">
        <span>P</span>
        <span>O</span>
        <span>L</span>
        <span>I</span>
        <span>S</span>
        <span>H</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
        <span>...</span>
        </div>
      </div>
    );
  };

export default Loader;