
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Euler, Group, Object3D } from 'three';
import { PerspectiveCamera } from 'three';
import { PlaneGeometry, Mesh, ShadowMaterial, Vector3} from 'three';
import { ReactNode, forwardRef, MutableRefObject  } from 'react';
import { useLoader } from '@react-three/fiber';
import { MathUtils } from 'three';
import { Quaternion } from 'three';


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
    <perspectiveCamera ref={ref} position={[0, 0, 7]} />
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
  // Define refs for position
  const origin = useRef(new Vector3(0, 0, 0));
  const direction = useRef(new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5));
  const speed = useRef(new Vector3(0, 0, 0));
  const [transitioning, setTransitioning] = useState(false);
  const targetQuaternion = useRef<Quaternion>(new Quaternion());

  // Define refs for rotation
  const originRotation = useRef(new Quaternion());
const rotationDirection = useRef(new Quaternion(0, Math.random() * 2 - 1, 0, 1).normalize());
const rotationSpeed = useRef(new Quaternion());
  const damping = 0.9;
  const rotationDamping = 0.2;

  const groupRef = useRef<Group>();
  const gltf = useLoader(GLTFLoader, '/3dmodel/diamond_in_the_rough_perfect.glb');

  gltf.scene.traverse((child) => {
    if ((child as Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      origin.current.copy(groupRef.current.position);
      originRotation.current.copy(groupRef.current.quaternion);
    }
  }, [groupRef.current]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const limitedDelta = Math.min(delta, 1 / 60);
  
      // Apply motion
      speed.current.add(direction.current.clone().multiplyScalar(limitedDelta * 0.013));
      const displacement = new Vector3().subVectors(origin.current, groupRef.current.position);
      speed.current.add(displacement.multiplyScalar(limitedDelta * 0.2));
      speed.current.multiplyScalar(damping);
      groupRef.current.position.add(speed.current);
  
      // Apply rotation
      if (!transitioning) {
        setTransitioning(true);
        const angle = Math.random() * Math.PI / 3 - Math.PI / 6;  // change Angle range
        rotationDirection.current.setFromAxisAngle(new Vector3(0, 1, 0), angle);
        rotationDirection.current.multiply(originRotation.current);
      }
  
      groupRef.current.quaternion.slerp(rotationDirection.current, limitedDelta * rotationDamping);
  
      if (groupRef.current.quaternion.angleTo(rotationDirection.current) < 0.01) {
        setTransitioning(false);
        rotationDirection.current.copy(groupRef.current.quaternion);
      }
  
      // Randomly change direction
      if (MathUtils.randInt(0, 100) > 98) {
        direction.current.copy(new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5));
      }
    }
  });
  


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
          <ambientLight position={[2,2,0]}/>
          <spotLight angle={1.74} position={[0, 13, -1]} castShadow />
          <Model />
          <Ground />
      </Canvas>
    </div>
  );
};
export default ThreeDModel;