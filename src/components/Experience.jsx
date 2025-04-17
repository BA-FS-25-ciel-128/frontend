import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
  useTexture,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar_neu";
import { useThree } from "@react-three/fiber";

import { PopUp } from "./PopupEffect";

const Dots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

export const Experience = () => {
  const cameraControls = useRef();

  const texture = useTexture("textures/grass.png");
  const viewport = useThree((state) => state.viewport);


  useEffect(() => {
      cameraControls.current.setLookAt(0, 1, 5, 0, 1.0, 0, true);
  }, []);
  return (
    <>
      <CameraControls ref={cameraControls} />

      <Avatar />
      <PopUp />

      <Avatar  />

      <Suspense>
        <mesh rotation={[-Math.PI/2,0,0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[50, 50]} />


      <meshBasicMaterial map={texture} />
      </mesh>
      </Suspense>

      <Environment preset="sunset" />

      {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
      <Suspense>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>

      <ContactShadows opacity={0.7} />
    </>
  );
};
