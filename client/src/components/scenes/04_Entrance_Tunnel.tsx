import React from "react";
import entranceImage from "../../assets/images/sceneImages/04_entrance_tunnel.webp";

const EntranceScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={entranceImage}
        alt="Event Entrance"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default EntranceScene;
