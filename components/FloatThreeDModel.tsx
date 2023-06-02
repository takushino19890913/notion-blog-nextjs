
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Group, Object3D } from 'three';
import { PerspectiveCamera } from 'three';
import { PlaneGeometry, Mesh, ShadowMaterial, Vector3} from 'three';
import { ReactNode, forwardRef, MutableRefObject  } from 'react';


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

const Ground = () => {
  const materialRef = new ShadowMaterial({ transparent: true, opacity: 0.3 });
  const geometryRef = new PlaneGeometry(10, 10);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <primitive object={geometryRef} />
      <primitive object={materialRef} />
    </mesh>
  );
};

const Model: React.FC = () => {
  const [gltf, setGLTF] = useState<{ scene: Object3D } | null>(null);
  const groupRef = useRef<Group>();

 useEffect(() => {
  new GLTFLoader().load('/3dmodel/diamond_in_the_rough_perfect.glb', (loadedGLTF) => {
    loadedGLTF.scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    setGLTF(loadedGLTF);
  });
}, []);

  return gltf ? <primitive ref={groupRef} object={gltf.scene} /> : null;
};

const CameraAdjuster: React.FC = () => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  return null;
};

const ThreeDModel: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas shadows>
        <CustomCamera />
        <CameraAdjuster />
          <ambientLight position={[1,1,0]}/>
          <spotLight angle={1.5} position={[0, 10, -1]} castShadow />
          <Model />
          <Ground />
      </Canvas>
    </div>
  );
};
export default ThreeDModel;