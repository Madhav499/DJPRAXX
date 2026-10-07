import React from "react";
import biographyEntranceImage from "../../assets/images/sceneImages/12_Biography_Entrance.webp";

const BiographyEntranceScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={biographyEntranceImage}
        alt="Event Entrance"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default BiographyEntranceScene;
