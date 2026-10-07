import React from "react";
import { motion, type Variants, useReducedMotion } from "framer-motion";

import { ArrowRight, CalendarDays, MapPin, Music2, Trophy } from "lucide-react";

import profilePic from "../../assets/images/profile/profilePic.png";

interface ArtistProfileSceneProps {
  onNext: () => void;
}

/* ==========================================================================
   ANIMATION
   ========================================================================== */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.35,
      staggerChildren: 0.09,
    },
  },
};

const textFromLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -65,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const imageFromRight: Variants = {
  hidden: {
    opacity: 0,
    x: 130,
    scale: 1.035,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: 0.25,
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ==========================================================================
   STAT CARD
   ========================================================================== */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <motion.div
      whileHover={{
        y: -3,
        borderColor: "rgba(240,124,34,0.58)",
      }}
      transition={{ duration: 0.22 }}
      className="
        group
        relative
        min-w-0
        overflow-hidden

        rounded-[16px]
        border
        border-white/[0.11]

        bg-white/[0.025]
        backdrop-blur-xl

        shadow-[0_15px_40px_rgba(0,0,0,0.2)]
      "
    >
      {/* Hover glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0

          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100

          bg-[radial-gradient(circle_at_10%_50%,rgba(240,124,34,0.12),transparent_50%)]
        "
      />

      <div
        className="
          relative
          flex
          min-h-[88px]
          items-center
          gap-3
          px-4
          py-3

          sm:min-h-[94px]
          sm:gap-4
          sm:px-5

          xl:min-h-[100px]
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center

            rounded-full

            border
            border-primary/40

            bg-primary/[0.06]

            sm:h-12
            sm:w-12

            xl:h-[52px]
            xl:w-[52px]
          "
        >
          {icon}
        </div>

        <div className="min-w-0">
          <span
            className="
              font-tech
              block

              text-[7px]
              font-semibold
              tracking-[0.22em]
              text-text-muted/70
              uppercase

              sm:text-[8px]
              xl:text-[9px]
            "
          >
            {label}
          </span>

          <span
            className="
              font-display
              mt-1
              block

              whitespace-nowrap

              text-[17px]
              leading-none
              font-bold
              text-white

              sm:text-[19px]
              xl:text-[22px]
            "
          >
            {value}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ==========================================================================
   DESKTOP PORTRAIT
   ========================================================================== */

const DesktopPortrait: React.FC = () => {
  return (
    <motion.div
      variants={imageFromRight}
      className="
        pointer-events-none
        absolute
        inset-y-0
        right-0
        z-10

        hidden
        w-[55%]

        lg:block
        xl:w-[57%]
        2xl:w-[58%]
      "
    >
      {/* Background orange glow */}
      <div
        className="
          absolute
          right-[-8%]
          top-[3%]

          h-[90%]
          w-[92%]

          rounded-full
          bg-primary/[0.095]
          blur-[110px]
        "
      />

      {/* Outer white ring */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.86,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 0.72,
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          absolute

          right-[-1vw]
          top-[7%]

          aspect-square

          w-[min(43vw,760px)]

          rounded-full

          border-[3px]
          border-white/90

          shadow-[
            0_0_18px_rgba(255,255,255,0.14),
            0_0_80px_rgba(240,124,34,0.11)
          ]

          xl:right-[1vw]
          xl:top-[5%]

          2xl:right-[2vw]
        "
      >
        {/* Inner orange ring */}
        <div
          className="
            absolute
            inset-[12px]

            rounded-full
            border
            border-primary/30
          "
        />

        <div
          className="
            absolute
            inset-[25px]

            rounded-full

            bg-[radial-gradient(circle_at_center,rgba(240,124,34,0.11),rgba(240,124,34,0.02)_55%,transparent_75%)]
          "
        />
      </motion.div>

      {/* Person image */}
      <motion.img
        src={profilePic}
        alt="Parth Chavda"
        draggable={false}
        initial={{ y: 3 }}
        animate={{
          y: [3, -3, 3],
        }}
        transition={{
          delay: 1.4,
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-0
          right-[-3%]
          z-20

          h-[86%]
          w-auto
          max-w-none

          object-contain
          object-bottom

          select-none

          lg:h-[88%]

          xl:right-[-1%]
          xl:h-[91%]

          2xl:right-[1%]
          2xl:h-[93%]
        "
        style={{
          filter: `
    drop-shadow(3px 0 0 rgba(255,255,255,0.9))
    drop-shadow(-3px 0 0 rgba(255,255,255,0.9))
    drop-shadow(0 3px 0 rgba(255,255,255,0.9))
    drop-shadow(0 -3px 0 rgba(255,255,255,0.9))
    drop-shadow(0 18px 35px rgba(0,0,0,0.68))
  `,
        }}
      />

      {/* Blend image into left side */}
      <div
        className="
          absolute
          inset-y-0
          left-0
          z-30

          w-[17%]

          bg-gradient-to-r
          from-bg-primary
          via-bg-primary/60
          to-transparent
        "
      />

      {/* Bottom image fade */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-30

          h-[10%]

          bg-gradient-to-t
          from-black/50
          to-transparent
        "
      />
    </motion.div>
  );
};

/* ==========================================================================
   MOBILE / TABLET PORTRAIT
   ========================================================================== */

const MobilePortrait: React.FC = () => {
  return (
    <motion.div
      variants={imageFromRight}
      className="
        relative
        mx-auto

        h-[310px]
        w-full
        max-w-[650px]

        overflow-hidden

        sm:h-[390px]
        md:h-[460px]

        lg:hidden
      "
    >
      {/* Glow */}
      <div
        className="
          absolute
          left-1/2
          top-[10%]

          h-[70%]
          w-[70%]

          -translate-x-1/2

          rounded-full

          bg-primary/[0.11]
          blur-[70px]
        "
      />

      {/* Circle */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.88,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 0.6,
          duration: 0.9,
        }}
        className="
          absolute
          left-1/2
          top-[12px]

          aspect-square

          w-[280px]
          -translate-x-1/2

          rounded-full

          border-[2px]
          border-white/85

          sm:w-[345px]
          md:w-[410px]
        "
      >
        <div
          className="
            absolute
            inset-[8px]

            rounded-full
            border
            border-primary/30
          "
        />
      </motion.div>

      {/* Person */}
      <img
        src={profilePic}
        alt="Parth Chavda"
        draggable={false}
        className="
          absolute
          bottom-0
          left-1/2
          z-10

          h-[290px]
          w-auto
          max-w-none

          -translate-x-1/2

          object-contain
          object-bottom

          sm:h-[375px]
          md:h-[445px]
        "
        style={{
          filter: `
            drop-shadow(1px 0 0 rgba(255,255,255,0.88))
            drop-shadow(-1px 0 0 rgba(255,255,255,0.88))
            drop-shadow(0 1px 0 rgba(255,255,255,0.88))
            drop-shadow(0 -1px 0 rgba(255,255,255,0.88))
          `,
        }}
      />

      {/* Fade */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-20

          h-[70px]

          bg-gradient-to-t
          from-bg-primary
          via-bg-primary/70
          to-transparent

          sm:h-[90px]
        "
      />
    </motion.div>
  );
};

/* ==========================================================================
   ARTIST PROFILE SCENE
   ========================================================================== */

export const ArtistProfileScene: React.FC<ArtistProfileSceneProps> = ({
  onNext,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="
        relative

        min-h-[100svh]
        w-full

        overflow-x-hidden
        overflow-y-auto

        bg-bg-primary
        text-text

        selection:bg-primary/30
        selection:text-white

        lg:h-[100svh]
        lg:min-h-[650px]
        lg:overflow-hidden
      "
    >
      {/* ================================================================= */}
      {/* BACKGROUND                                                        */}
      {/* ================================================================= */}

      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="
            absolute
            inset-0

            bg-[linear-gradient(90deg,#050507_0%,#050507_37%,#070606_51%,#130903_78%,#190b03_100%)]
          "
        />

        {/* right orange light */}
        <div
          className="
            absolute
            right-[-10%]
            top-[-15%]

            h-[120%]
            w-[65%]

            rounded-full

            bg-primary/[0.09]
            blur-[130px]
          "
        />

        {/* centre atmosphere */}
        <div
          className="
            absolute
            left-[35%]
            top-[20%]

            h-[65%]
            w-[35%]

            rounded-full

            bg-primary/[0.035]
            blur-[100px]
          "
        />

        {/* vignette */}
        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.58)_100%)]
          "
        />

        <div
          className="
            absolute
            inset-x-0
            top-0

            h-[16%]

            bg-gradient-to-b
            from-black/55
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-x-0
            bottom-0

            h-[18%]

            bg-gradient-to-t
            from-black/55
            to-transparent
          "
        />
      </div>

      {/* Desktop portrait */}
      {!shouldReduceMotion && <DesktopPortrait />}

      {shouldReduceMotion && (
        <div className="hidden lg:block">
          <DesktopPortrait />
        </div>
      )}

      {/* ================================================================= */}
      {/* DESKTOP / LARGE TABLET                                            */}
      {/* ================================================================= */}

      <div
        className="
          relative
          z-40

          mx-auto
          hidden

          h-full
          w-full
          max-w-[1800px]

          lg:flex
          lg:items-center

          /* Safe area for your fixed top navigation */
          lg:pt-[clamp(105px,13vh,140px)]

          /* Safe area for your fixed music player */
          lg:pb-[clamp(78px,10vh,105px)]

          lg:px-[clamp(42px,5.5vw,100px)]
        "
      >
        <motion.div
          variants={containerVariants}
          className="
            flex
            w-[45%]
            max-w-[680px]
            min-w-0
            flex-col
            justify-center

            xl:w-[44%]
            2xl:max-w-[720px]
          "
        >
          {/* ============================================================= */}
          {/* ROLE                                                          */}
          {/* ============================================================= */}

          <motion.div
            variants={textFromLeft}
            className="
              flex
              items-center
              gap-3

              font-tech

              text-[8px]
              font-medium
              tracking-[0.34em]
              text-white/67
              uppercase

              xl:text-[10px]
              2xl:text-[11px]
            "
          >
            <Music2
              className="
                h-3.5
                w-3.5
                shrink-0
                text-primary

                xl:h-4
                xl:w-4
              "
            />

            <span>DJ</span>

            <span className="text-primary">/</span>

            <span>Producer</span>

            <span className="text-primary">/</span>

            <span>Curator</span>
          </motion.div>

          {/* ============================================================= */}
          {/* NAME                                                          */}
          {/* ============================================================= */}

          <motion.h1
            variants={textFromLeft}
            className="
              font-display

              mt-[clamp(13px,2vh,20px)]

              leading-none
              tracking-[-0.06em]
              uppercase
            "
          >
            <span
              className="
                block

                bg-gradient-to-b
                from-white
                from-18%
                via-white
                via-47%
                to-zinc-500
                bg-clip-text

                text-[clamp(62px,5.6vw,106px)]
                leading-[0.74]
                font-black
                text-transparent
              "
            >
              Parth
            </span>

            <span
              className="
                mt-[0.24em]
                block

                bg-gradient-to-b
                from-[#ff9b34]
                via-primary
                to-[#ff5800]
                bg-clip-text

                text-[clamp(59px,5.35vw,101px)]
                leading-[0.75]
                font-black
                text-transparent

                drop-shadow-[0_8px_22px_rgba(240,124,34,0.13)]
              "
            >
              Chavda
            </span>
          </motion.h1>

          {/* ============================================================= */}
          {/* LOCATION                                                      */}
          {/* ============================================================= */}

          <motion.div
            variants={textFromLeft}
            className="
              mt-[clamp(17px,2.5vh,26px)]

              flex
              items-center
              gap-2.5
            "
          >
            <div
              className="
                flex

                h-7
                w-7

                shrink-0
                items-center
                justify-center

                rounded-full
                bg-white

                shadow-[0_0_18px_rgba(255,255,255,0.13)]

                xl:h-8
                xl:w-8
              "
            >
              <MapPin
                className="
                  h-3.5
                  w-3.5
                  fill-black
                  text-black

                  xl:h-4
                  xl:w-4
                "
              />
            </div>

            <span
              className="
                font-tech

                text-[8px]
                font-semibold
                tracking-[0.28em]
                text-white/68
                uppercase

                xl:text-[9px]
                2xl:text-[10px]
              "
            >
              Rajkot, Gujarat, India
            </span>
          </motion.div>

          {/* ============================================================= */}
          {/* STATS                                                         */}
          {/* ============================================================= */}

          <motion.div
            variants={fadeUp}
            className="
              mt-[clamp(20px,3vh,30px)]

              grid
              grid-cols-2
              gap-3

              xl:gap-4
            "
          >
            <StatCard
              label="Experience"
              value="4+ YEARS"
              icon={<CalendarDays className="h-[18px] w-[18px] text-primary" />}
            />

            <StatCard
              label="Headline Sets"
              value="20+ EVENTS"
              icon={<Trophy className="h-[18px] w-[18px] text-primary" />}
            />
          </motion.div>

          {/* ============================================================= */}
          {/* PHILOSOPHY                                                    */}
          {/* ============================================================= */}

          <motion.div
            variants={fadeUp}
            className="
              mt-[clamp(20px,3vh,29px)]
            "
          >
            <div className="flex items-center gap-4">
              <span
                className="
                  font-tech

                  text-[8px]
                  font-semibold
                  tracking-[0.3em]
                  text-white/52
                  uppercase

                  xl:text-[9px]
                "
              >
                Philosophy
              </span>

              <span
                className="
                  h-[2px]
                  w-[55px]

                  bg-gradient-to-r
                  from-primary
                  to-[#ff5500]
                "
              />
            </div>

            <div
              className="
                mt-3

                flex
                items-start
                gap-3
              "
            >
              <span
                className="
                  font-display

                  -mt-1.5

                  shrink-0

                  text-[42px]
                  leading-none
                  font-black
                  text-primary

                  xl:text-[48px]
                "
              >
                “
              </span>

              <p
                className="
                  font-body

                  max-w-[560px]

                  text-[11px]
                  leading-[1.7]
                  font-light
                  text-white/67
                  italic

                  xl:text-[13px]
                  2xl:text-[14px]
                "
              >
                Music is not just performance; it is a conversation. The venue
                is our room. Every drop is a memory.
              </p>
            </div>
          </motion.div>

          {/* ============================================================= */}
          {/* BUTTON                                                        */}
          {/* ============================================================= */}

          <motion.div
            variants={fadeUp}
            className="
              mt-[clamp(19px,2.8vh,28px)]
            "
          >
            <motion.button
              type="button"
              onClick={onNext}
              whileHover={{
                scale: 1.01,
                y: -2,
                boxShadow:
                  "0 0 30px rgba(240,124,34,0.27), 0 15px 35px rgba(0,0,0,0.35)",
              }}
              whileTap={{
                scale: 0.985,
              }}
              className="
                group
                relative

                flex

                h-[54px]
                w-full
                max-w-[560px]

                items-center
                justify-between

                overflow-hidden

                rounded-[13px]

                border
                border-orange-300/75

                bg-gradient-to-r
                from-[#ff6510]
                via-primary
                to-[#ec5003]

                px-5

                shadow-[0_0_22px_rgba(240,124,34,0.18)]

                xl:h-[62px]
                xl:px-7
              "
            >
              {/* shine */}
              <span
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-[-40%]

                  w-[25%]

                  -skew-x-[20deg]

                  bg-gradient-to-r
                  from-transparent
                  via-white/25
                  to-transparent

                  transition-[left]
                  duration-700

                  group-hover:left-[125%]
                "
              />

              <span
                className="
                  font-tech
                  relative
                  z-10

                  text-[9px]
                  font-bold
                  tracking-[0.3em]
                  text-white
                  uppercase

                  xl:text-[10px]
                  2xl:text-[11px]
                "
              >
                Proceed to Booking
              </span>

              <div
                className="
                  relative
                  z-10

                  flex
                  h-7
                  w-7
                  items-center
                  justify-center

                  rounded-full
                  bg-white/[0.09]

                  transition-transform
                  duration-300

                  group-hover:translate-x-1

                  xl:h-8
                  xl:w-8
                "
              >
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* ================================================================= */}
      {/* MOBILE + TABLET                                                   */}
      {/* ================================================================= */}

      <div
        className="
          relative
          z-40

          mx-auto

          flex
          min-h-[100svh]
          w-full
          max-w-[850px]

          flex-col

          px-4

          /* top fixed nav safe area */
          pt-[90px]

          /* bottom fixed player safe area */
          pb-[105px]

          sm:px-7
          sm:pt-[105px]

          md:px-10
          md:pt-[115px]

          lg:hidden
        "
      >
        {/* Image first */}
        <MobilePortrait />

        {/* Content */}
        <motion.div
          variants={containerVariants}
          className="
            relative
            z-30

            mx-auto
            -mt-3

            w-full
            max-w-[690px]

            sm:-mt-6
          "
        >
          {/* Role */}
          <motion.div
            variants={textFromLeft}
            className="
              font-tech

              flex
              flex-wrap
              items-center
              justify-center
              gap-x-2
              gap-y-1

              text-[8px]
              font-medium
              tracking-[0.25em]
              text-white/62
              uppercase

              sm:text-[9px]
            "
          >
            <Music2 className="h-3.5 w-3.5 text-primary" />

            <span>DJ</span>

            <span className="text-primary">/</span>

            <span>Producer</span>

            <span className="text-primary">/</span>

            <span>Curator</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={textFromLeft}
            className="
              font-display

              mt-4

              text-center

              leading-none
              font-black
              tracking-[-0.055em]
              uppercase
            "
          >
            <span
              className="
                block

                bg-gradient-to-b
                from-white
                to-zinc-400
                bg-clip-text

                text-[clamp(48px,15vw,84px)]
                leading-[0.78]
                text-transparent
              "
            >
              Parth
            </span>

            <span
              className="
                mt-[0.2em]
                block

                bg-gradient-to-b
                from-[#ff9830]
                via-primary
                to-[#ff5700]
                bg-clip-text

                text-[clamp(46px,14vw,80px)]
                leading-[0.8]
                text-transparent
              "
            >
              Chavda
            </span>
          </motion.h1>

          {/* Location */}
          <motion.div
            variants={fadeUp}
            className="
              mt-5

              flex
              items-center
              justify-center
              gap-2
            "
          >
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center

                rounded-full
                bg-white
              "
            >
              <MapPin className="h-3.5 w-3.5 fill-black text-black" />
            </div>

            <span
              className="
                font-tech

                text-[8px]
                font-semibold
                tracking-[0.24em]
                text-white/65
                uppercase

                sm:text-[9px]
              "
            >
              Rajkot, Gujarat, India
            </span>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="
              mt-6

              grid
              grid-cols-1
              gap-3

              min-[500px]:grid-cols-2
            "
          >
            <StatCard
              label="Experience"
              value="4+ YEARS"
              icon={<CalendarDays className="h-[18px] w-[18px] text-primary" />}
            />

            <StatCard
              label="Headline Sets"
              value="20+ EVENTS"
              icon={<Trophy className="h-[18px] w-[18px] text-primary" />}
            />
          </motion.div>

          {/* Philosophy */}
          <motion.div
            variants={fadeUp}
            className="
              mt-6

              rounded-[16px]

              border
              border-white/[0.07]

              bg-white/[0.018]

              p-4

              sm:p-5
            "
          >
            <div className="flex items-center gap-3">
              <span
                className="
                  font-tech

                  text-[8px]
                  font-semibold
                  tracking-[0.28em]
                  text-white/50
                  uppercase
                "
              >
                Philosophy
              </span>

              <div
                className="
                  h-[2px]
                  w-12

                  bg-gradient-to-r
                  from-primary
                  to-transparent
                "
              />
            </div>

            <p
              className="
                font-body

                mt-3

                text-[12px]
                leading-6
                text-white/65
                italic

                sm:text-[13px]
                sm:leading-7
              "
            >
              “Music is not just performance; it is a conversation. The venue is
              our room. Every drop is a memory.”
            </p>
          </motion.div>

          {/* CTA */}
          <motion.button
            variants={fadeUp}
            type="button"
            onClick={onNext}
            whileTap={{ scale: 0.98 }}
            className="
              font-tech

              mt-5

              flex
              h-[58px]
              w-full

              items-center
              justify-between

              rounded-[14px]

              border
              border-orange-300/70

              bg-gradient-to-r
              from-[#ff6410]
              via-primary
              to-[#ed5004]

              px-5

              text-[9px]
              font-bold
              tracking-[0.27em]
              text-white
              uppercase

              shadow-[0_0_20px_rgba(240,124,34,0.15)]

              sm:h-[62px]
              sm:px-6
              sm:text-[10px]
            "
          >
            <span>Proceed to Booking</span>

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center

                rounded-full
                bg-white/[0.1]
              "
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ArtistProfileScene;
