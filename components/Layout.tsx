import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FullPageLoader from './FullPageLoader';
import { useRouter } from 'next/router';
import {usePathname} from 'next/navigation'
import Head from 'next/head';
import useWindowDimensions from '../hooks/Dimension';
import HambergerIcon from './HambergerIcon';
import Wave from 'react-wavify';
import { CSSTransition } from 'react-transition-group';
import DelayedScrollAnimation from './DelayScrollAnimation';
import DelayAnimationNavMenu from './DelayAnimationNavMenu';


type Props = {
  children?: ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnim, setMenuAnim] = useState(false);
  const [transit, setTransit] = useState(false);
  const [menuOpenTime, setMenuOpenTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [waveTransit,setWaveTransit] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [showWave, setShowWave] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

useEffect(() => {
    console.log("istransitioning: ", isTransitioning)
}, [hovering, menuOpen, transit, isTransitioning]);

useEffect(() => {
  setTransit(false);
},[pathname])

  if (typeof window !== 'undefined') {
    let { h, w } = useWindowDimensions();
    useEffect(() => {
      setHeight(h);
      setWidth(w);
    }, [w, h]);
  }
  useEffect(() => {
    if(!menuAnim){
      console.log("menuAnimfalse")
    }

  },[menuAnim])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showWave) {
      if(menuAnim){
        setTimeout(() => {
          setMenuAnim(!menuAnim)
        },1000)
      } else {
        setMenuAnim(!menuAnim)
      }
      setMenuOpen(!menuOpen);
      timeoutId = setTimeout(() => {
        setShowWave(false);
      }, 1000);
    } 
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showWave]);

  useEffect(() => {
    if(menuOpen){

    }
  }, [menuOpen])

  const handleClick = () => {
    setMenuOpenTime(Date.now());
   setShowWave(!showWave)
   if(hovering){
    
   }
  };
 //bg-[#FCB05D]
  return (
    <div className="min-h-screen bg-[#FCF2DC] overflow-hidden overflow-y-auto">
      <Head>
        <title>Thought in the rough</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="fixed bg-[#FCF2DC] pl-20 py-3 h-[20vh] text-[#002066] text-xl font-bold w-full z-50 opacity-100">
        <div className="flex items-center justify-between w-11/12 h-full" style={{position:"relative",zIndex:52}}>
          <Link href="/" passHref>
            <div className="reflection w-auto max-w-full h-full flex items-center py-3" style={{zIndex:52}}>
              <Image src="/images/logo.png" alt={"logo"} width={200} height={44.6} className='object-contain h-full'/>
            </div>
          </Link>
          <button
            className=""
            onClick={handleClick}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{position:"relative",zIndex:52}}
          >
            <HambergerIcon />
          </button>
        </div>

<CSSTransition
  in={hovering && !menuOpen}
  timeout={2000}
  classNames="wave-hovering"
  unmountOnExit
  onExited={() => {
    console.log("done")
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
    zIndex: 50,
    transform: `scale(1, -1.4)`,
  }}
/>
 )}
 </CSSTransition>

        <CSSTransition
  in={menuOpen || menuAnim}
  timeout={1000}
  classNames="menu-transform"
  unmountOnExit
  onExited={() => {
    console.log("done")
  }}
>
  {(state) => (
    <div className="fixed bg-[#FCF2DC] w-screen opacity-100"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 50,
      height: height
    }}>
      <div className="flex flex-row">
      <DelayAnimationNavMenu className="flex flex-col items-center w-1/2 min-h-screen border-r-2 justify-center" menuOpenTime={menuOpenTime} delayTime={1000} delayMultiply={0.05} menuOpen={menuOpen}>
        <p>
          CONTACT ME!
        </p>
      </DelayAnimationNavMenu>
        <DelayAnimationNavMenu className="mt-[20vh] flex flex-col min-h-screen w-1/3 mr-auto text-6xl" menuOpenTime={menuOpenTime} delayTime={1000} delayMultiply={0.05} menuOpen={menuOpen}>
        <a className="ml-40 mb-3 text-[#a9c653] cursor-pointer" style={{zIndex:99}} onClick={() => {
          setMenuOpen(false);
          setIsTransitioning(true);
          setIsLoading(true);
          setTimeout(() => {setMenuAnim(false);},1000);
          setTimeout(() => {setTransit(true);},2000);
          setTimeout(() => {router.push('/')},2000);
           }} >
          Home
        </a>
        <a className="ml-40 my-3 cursor-pointer" href="/about" style={{zIndex:52}}  onClick={() => {
          setMenuOpen(false);
          setIsTransitioning(true);
          setIsLoading(true);
          setTimeout(() => {setMenuAnim(false);},1000);
          setTimeout(() => {setTransit(true);},2000);
          setTimeout(() => {router.push('/about')},2000);
           }} >
          About
        </a>
        <a className="ml-40 my-3 cursor-pointer" href="/works" style={{zIndex:52}}  onClick={() => {
          setMenuOpen(false);
          setIsTransitioning(true);
          setIsLoading(true);
          setTimeout(() => {setMenuAnim(false);},1000);
          setTimeout(() => {setTransit(true);},2000);
          setTimeout(() => {router.push('/works')},2000);
           }} >
          Works
        </a>
        <a className="ml-40 my-3 cursor-pointer" href="/blog" style={{zIndex:52}}  onClick={() => {
          setMenuOpen(false);
          setIsTransitioning(true);
          setIsLoading(true);
          setTimeout(() => {setMenuAnim(false);},1000);
          setTimeout(() => {setTransit(true);},2000);
          setTimeout(() => {router.push('/blog')},2000);
           }} >
          Blog
        </a>
        <a className="ml-40 mt-3 mb-10 cursor-pointer" href="/contact" style={{zIndex:52}}  onClick={() => {
          setMenuOpen(false);
          setIsTransitioning(true);
          setIsLoading(true);
          setTimeout(() => {setMenuAnim(false);},1000);
          setTimeout(() => {setTransit(true);},2000);
          setTimeout(() => {router.push('/contact')},2000);
           }} >
          Contact
        </a>
        </DelayAnimationNavMenu>
      </div>
    </div>

  )}
</CSSTransition>
<CSSTransition
  in={menuOpen || menuAnim}
  timeout={1000}
  classNames="wave-transform-reverse"
  unmountOnExit
  onExited={() => {
    console.log("done")
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
  in={menuOpen || menuAnim}
  timeout={1000}
  classNames="wave-transform"
  unmountOnExit
  onExited={() => {
    console.log("done")
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

      </nav>
      
      <FullPageLoader isLoading={isLoading} setIsLoading={setIsLoading} waveTransit={waveTransit} setWaveTransit={setWaveTransit} isTransitioning={isTransitioning}>
        <div className="mx-auto mt-[20vh] snap-y snap-mandatory overflow-y-auto" id="snapContainer"
          style={{ maxHeight: height * 80 / 100 }}
        >
          <main className={transit ? "mx-auto main-transit": "mx-auto main-transit-done"}>{children}</main>
        </div>
      </FullPageLoader>
    </div>
  );
};

export default Layout;
