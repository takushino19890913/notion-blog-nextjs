import { useEffect } from 'react';
import Particles from 'react-tsparticles';

const ParticlesComponent = () => {
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.position = 'absolute';
    }
  }, []);
  const particlesInit = async (main) => {
    console.log(main);
  };

  const particlesLoaded = async (container) => {
    console.log(container);
  };

  return (
    <div style={{ height: '100vh',width:'100vw', position: 'absolute' }}> {/* Create a parent element with specific height */}
      <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      width="100vw"
      height="100vh"
      options={{
        particles: {
          number: {
            value: 7, 
          },
          color: {
            value: ['#AEC6CF', '#D1BAD2', '#B5EAD7']
        },
          opacity: {
            value:0.6
          },
          shape: {
            type: "circle", 
          },
          move: {
            enable: true, 
            speed: { min: 0.8, max: 1.5 }, 
            direction: "none", 
            random: true, 
          },
          size: {
            value: { min: 5, max: 15 }, 
            random: { enable: true, minimumValue: 5 }, 
          },
        },
      }}
    />
    </div>
    
  );
};

export default ParticlesComponent;
