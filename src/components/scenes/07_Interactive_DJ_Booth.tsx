import React from "react";
import djBoothImage from "../../assets/images/sceneImages/07_Interactive_DJ_Booth.webp";

const InteractiveDJBoothScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={djBoothImage}
        alt="Interactive DJ Booth"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default InteractiveDJBoothScene;
