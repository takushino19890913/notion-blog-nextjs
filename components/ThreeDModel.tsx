import React, { useRef, useState, useEffect, forwardRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Group, Object3D, Mesh, ShadowMaterial, Vector3, PlaneGeometry, PerspectiveCamera, TextureLoader, MeshBasicMaterial, Box3, MeshPhongMaterial, RepeatWrapping, Plane  } from 'three';

const CustomCamera: React.FC = () => {
  const ref = useRef<PerspectiveCamera>(null);
  const { set } = useThree();

  useEffect(() => {
    if (ref.current) {
      set({ camera: ref.current });
    }
  }, [ref.current]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.updateProjectionMatrix();
    }
  });

  return (
    <perspectiveCamera ref={ref} position={[0, 0, 8]} />
  );
};

const Ground = (props) => {
  const groundRef = useRef<Mesh>();
  const cracksRef = useRef<Mesh>();

  useEffect(() => {
    if (groundRef.current) {
      groundRef.current.material = new ShadowMaterial({ transparent: true, opacity: 0.3 });
      groundRef.current.geometry = new PlaneGeometry(10, 10);
    }
  }, []);

  useEffect(() => {
    if (cracksRef.current && props.cracksTexture && props.displayCracks) {
      cracksRef.current.material = new MeshBasicMaterial({ map: props.cracksTexture, transparent: true, opacity: 1, depthWrite: false });
      cracksRef.current.geometry = new PlaneGeometry(10, 10);
    } else if (cracksRef.current) {
      cracksRef.current.material = new MeshBasicMaterial({ transparent: true, opacity: 0 });
    }
  }, [props.cracksTexture, props.displayCracks]);

  return (
    <>
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.299, 0]} receiveShadow />
      <mesh ref={cracksRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.299, 0]} />
    </>
  );
};



const Model: React.FC<{ applyCracks: () => void }> = ({ applyCracks }) => {
  const [gltf, setGLTF] = useState<{ scene: Object3D } | null>(null);
  const groupRef = useRef<Group>();
  
  const velocity = useRef(new Vector3(0, 0, 0));
  const acceleration = useRef(new Vector3(0, -0.0005, 0));

  const boundingBox = useRef<Box3 | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {  // Add this line
      new GLTFLoader().load('/3dmodel/diamond_in_the_rough_perfect.glb', (loadedGLTF) => {
        loadedGLTF.scene.traverse((child) => {
          if ((child as Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        setGLTF(loadedGLTF);
      });
    }, 8000);  // Add this line. This will delay the loading by 2 seconds

    return () => clearTimeout(timer);  // Add this line to clear the timeout when the component unmounts
  }, []);

  useEffect(() => {
    if (gltf && !boundingBox.current) {
      boundingBox.current = new Box3().setFromObject(gltf.scene);
      // 初期位置を設定
    if (groupRef.current) {
      const initialPosition = new Vector3(0, 4.5, 0); // 任意の初期位置を設定
      groupRef.current.position.copy(initialPosition);
    }
    }
  }, [gltf]);

  useFrame((state, delta) => {
    if (groupRef.current && boundingBox.current) {
      const bottomY = groupRef.current.position.y + boundingBox.current.min.y;
  
      if (bottomY > -1.3) {
        velocity.current.add(acceleration.current);
        groupRef.current.position.add(velocity.current);
      } else {
        // ここで、オブジェクトが地面に接触したときのY座標を調整
        groupRef.current.position.y = -1.8 - boundingBox.current.min.y;
        applyCracks();
      }
    }
  });

  return gltf ? <primitive ref={groupRef} object={gltf.scene} /> : null;
};


const CameraAdjuster: React.FC = () => {
  const { camera, size ,gl } = useThree();
  const clipPlane = new Plane(new Vector3(0, 1, 0), 1.3);

  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  useEffect(() => {
    gl.localClippingEnabled = true;
    gl.clippingPlanes = [clipPlane];
  }, [gl]);

  return null;
};

const ThreeDModel: React.FC = () => {
  const groundRef = useRef<Mesh>();
  const [cracksTexture, setCracksTexture] = useState(null);
  const [displayCracks, setDisplayCracks] = useState(false);
  

  useEffect(() => {
    new TextureLoader().load('/images/meteo.png', (loadedTexture) => {
      setCracksTexture(loadedTexture);
    });
  }, []);

  const applyCracks = () => {
    setDisplayCracks(true);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas shadows>
        <CustomCamera />
        <CameraAdjuster />
        <ambientLight position={[1, 1, 0]} />
        <spotLight angle={1.5} position={[0, 10, -1]} castShadow />
        <Model applyCracks={applyCracks} />
        <Ground ref={groundRef} cracksTexture={cracksTexture} displayCracks={displayCracks} />
      </Canvas>
    </div>
  );
};


export default ThreeDModel;
