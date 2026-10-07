import React from "react";
import mainStageImage from "../../assets/images/sceneImages/06_Main_Stage_Reveal.png";

const MainStageScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={mainStageImage}
        alt="Main Stage Reveal"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MainStageScene;
