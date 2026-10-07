import React from "react";
import audienceImage from "../../assets/images/sceneImages/05_audience.png";

const AudienceScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={audienceImage}
        alt="Event Entrance"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default AudienceScene;
