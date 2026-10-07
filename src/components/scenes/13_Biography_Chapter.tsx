import React from "react";
import biographyChapterImage from "../../assets/images/sceneImages/13_Biography_Chapters.webp";

const BiographyChapterScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={biographyChapterImage}
        alt="Event chapter background"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default BiographyChapterScene;
