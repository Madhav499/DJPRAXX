import React from "react";
import voidArrivalImage from "../../assets/images/sceneImages/03_entrance.webp";
import poster from "../../assets/images/posters/poster.jpg";
import { motion } from "framer-motion";

const Void_Arrival: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={voidArrivalImage}
        alt="Event Entrance"
        className="w-full h-full object-cover"
      />

      {/* Floating Poster - Left */}
      <motion.div
        className="
          z-5 absolute
          top-[20%] left-[13%] w-[19%]
          lg:top-[20%] lg:left-[13%] lg:w-[19%]
          md:top-[22%] md:left-[9%] md:w-[24%]
          sm:top-[24%] sm:left-[6%] sm:w-[28%]
        "
        style={{ perspective: 900 }}
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* shadow */}
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

        <motion.img
          src={poster}
          alt="Floating Poster 1"
          className="w-full h-auto shadow-[0_25px_35px_rgba(0,0,0,0.65)] shadow-black origin-center"
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: 5,
            rotateX: 3,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />
      </motion.div>

      {/* Floating Poster - Right */}
      <motion.div
        className="
          z-5 absolute
          top-[20%] right-[14%] w-[19%]
          lg:top-[20%] lg:right-[14%] lg:w-[19%]
          md:top-[22%] md:right-[9%] md:w-[24%]
          sm:top-[24%] sm:right-[6%] sm:w-[28%]
        "
        style={{ perspective: 900 }}
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.img
          src={poster}
          alt="Floating Poster 2"
          className="w-full h-auto shadow-[0_25px_35px_rgba(0,0,0,0.65)] shadow-black origin-center"
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: -5,
            rotateX: 3,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Void_Arrival;
