import React from "react";
import musicImage from "../../assets/images/sceneImages/Music_Scene.png";

const MusicScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={musicImage}
        alt="Event Entrance"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MusicScene;
