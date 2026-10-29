import React from "react";
import DustParticles from "../canvas/DustParticles";
import BottomFogCanvas from "../canvas/BottomFogCanvas";

interface CanvasLayerProps {
  activeScene: string;
}

const CanvasLayer: React.FC<CanvasLayerProps> = ({
  activeScene,
}: CanvasLayerProps) => {
  return (
    <div>
      <DustParticles activeScene={activeScene} />

      {activeScene === "16_booking_success" && <BottomFogCanvas />}
    </div>
  );
};

export default CanvasLayer;
