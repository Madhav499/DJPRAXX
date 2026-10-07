import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CTABtnProps {
  onNext: () => void;
  text: string;
}

const CTABtn: React.FC<CTABtnProps> = ({ onNext, text }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        delay: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mt-10"
    >
      <motion.button
        type="button"
        onClick={onNext}
        whileTap={{ scale: 0.97 }}
        className="
              group
              relative
              flex
              h-[58px]
              min-w-[270px]
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-[#ff9b51]/60
              bg-primary
              px-9
              text-[9px]
              font-bold
              uppercase
              tracking-[0.27em]
              text-[#120904]
              outline-none
              transition-all
              duration-500
              hover:-translate-y-[2px]
              hover:border-[#ffaf73]
              hover:bg-[#ff8b33]
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-4
              focus-visible:ring-offset-[#050507]
            "
        style={{
          boxShadow:
            "0 14px 45px rgba(240,124,34,0.22), 0 0 60px rgba(240,124,34,0.10), inset 0 1px 0 rgba(255,255,255,0.30)",
        }}
      >
        {/* Button inner highlight */}

        <span
          aria-hidden="true"
          className="
                pointer-events-none
                absolute
                inset-x-3
                top-[1px]
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/60
                to-transparent
              "
        />

        {/* Light sweep */}

        <span
          aria-hidden="true"
          className="
                pointer-events-none
                absolute
                inset-y-[-20%]
                left-[-35%]
                w-[20%]
                -skew-x-[18deg]
                bg-white/30
                blur-md
                transition-all
                duration-700
                ease-out
                group-hover:left-[120%]
              "
        />

        {/* Button content */}

        <span
          className="
                relative
                z-10
                flex
                items-center
                gap-3
                text-[11px]
              "
        >
          {text}
          <span
            className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-black/10
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:bg-black/15
                "
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </span>
      </motion.button>
    </motion.div>
  );
};

export default CTABtn;
