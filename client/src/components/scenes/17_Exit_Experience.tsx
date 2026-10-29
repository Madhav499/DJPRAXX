import React from "react";
import exitExperienceImage from "../../assets/images/sceneImages/17_Exit_Experience.webp";

const ExitExperienceScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={exitExperienceImage}
        alt="Event chapter background"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ExitExperienceScene;
