import React from "react";
import finalScreenImage from "../../assets/images/sceneImages/18_Final_Screen.png";

const FinalScreenScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={finalScreenImage}
        alt="Event chapter background"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default FinalScreenScene;
