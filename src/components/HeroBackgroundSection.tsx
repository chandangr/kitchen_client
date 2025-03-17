import { ColourfulText } from "@/components/ui/colourful-text";
import { motion } from "motion/react";

export type MotionTextProps = {
  title?: string;

  companyLogo?: string;
  motionText?: string;
  endText?: string;
  backgroundImage?: string;
  titleColor?: string;
  subtitleColor?: string;
  subtitleText?: string;
  descriptionColor?: string;
  descriptionText?: string;
};

export function HeroBackgroundSection({
  title,
  companyLogo,
  motionText,
  endText,
  backgroundImage,
  titleColor,
  subtitleColor,
  descriptionColor,
  subtitleText,
  descriptionText,
}: MotionTextProps) {
  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
      <motion.img
        src={companyLogo}
        alt="Company Logo"
        className="h-12 mb-4 absolute top-0 left-0"
      />
      <motion.img
        src={backgroundImage}
        className="h-full w-full object-cover absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      />
      <div className="flex flex-col items-center justify-center z-10">
        <h1
          style={{ color: titleColor }}
          className="text-2xl md:text-5xl lg:text-7xl font-bold text-center relative z-2 font-sans"
        >
          {title} <ColourfulText text={motionText ?? ""} /> <br /> {endText}
        </h1>
        {subtitleText && (
          <h2 style={{ color: subtitleColor }} className="text-3xl">
            {subtitleText}
          </h2>
        )}
        {descriptionText && (
          <h2
            style={{ color: descriptionColor }}
            className="text-base text-xl w-[70%]"
          >
            {descriptionText}
          </h2>
        )}
      </div>
    </div>
  );
}
