import Image from 'next/image';

const Loader = () => {
    return (
      <div className="loader flex flex-col justify-center items-center min-h-[85vh] bg-[#FCF2DC]">
        <div className="">
        <Image src="/images/diamond_in_the_rough_blue.png" width={200} height={200} alt={"loading img"}/>     
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