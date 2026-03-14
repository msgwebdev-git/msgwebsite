"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { Play, X, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./layout";

interface ShowreelSectionProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function ShowreelSection({
  videoSrc = "/showreel.mp4",
  posterSrc = "/showreel-poster.jpg",
}: ShowreelSectionProps) {
  const t = useTranslations("showreel");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const isInView = useInView(sectionRef, { amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  // Pause/play video based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView) {
      video.play().catch(() => {
        // Autoplay was prevented, that's ok
      });
    } else {
      video.pause();
    }
  }, [isInView]);

  // Initial autoplay attempt
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.muted = true;
      video.play().catch(() => {
        // Autoplay was prevented
      });
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener("loadeddata", playVideo, { once: true });
      video.addEventListener("canplay", playVideo, { once: true });
    }

    return () => {
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
    };
  }, []);

  // Update progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Handle mute toggle
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  // Open fullscreen modal
  const openModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsModalOpen(true);
  };

  // Close modal and resume background video
  const closeModal = () => {
    setIsModalOpen(false);
    if (videoRef.current && isInView) {
      videoRef.current.play();
    }
  };

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      <section
        ref={sectionRef}
        id="showreel"
        className="relative py-fluid-section -mt-[5vh] sm:-mt-[15vh]"
      >
        <Container>
          <motion.div
            style={{ y, scale }}
            className="relative aspect-video overflow-hidden bg-muted group"
          >
            {/* Background Video */}
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Center Play Button */}
            <button
              onClick={openModal}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center",
                "cursor-pointer"
              )}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Outer square pulse */}
                <motion.div
                  className="absolute border-2 border-white/30 w-14 h-14 sm:w-20 sm:h-20 -ml-7 -mt-7 sm:-ml-10 sm:-mt-10 left-1/2 top-1/2"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute border-2 border-white/20 w-14 h-14 sm:w-20 sm:h-20 -ml-7 -mt-7 sm:-ml-10 sm:-mt-10 left-1/2 top-1/2"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Main button */}
                <div
                  className={cn(
                    "w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28",
                    "bg-primary",
                    "flex items-center justify-center",
                    "transition-all duration-300"
                  )}
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white fill-white ml-0.5" />
                </div>
              </motion.div>

              {/* Label */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-fluid-base lg:text-fluid-lg font-heading tracking-widest text-white"
              >
                {t("play")} {t("title")}
              </motion.span>
            </button>

            {/* Bottom controls */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              {/* Mute/Unmute button */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center",
                  "bg-black/50 backdrop-blur-sm",
                  "text-white hover:bg-black/70 transition-colors"
                )}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Fullscreen button */}
              <button
                onClick={openModal}
                aria-label="Fullscreen"
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center",
                  "bg-black/50 backdrop-blur-sm",
                  "text-white hover:bg-black/70 transition-colors"
                )}
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Fullscreen Video Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            aria-label="Close"
            className={cn(
              "absolute top-3 right-3 sm:top-6 sm:right-6 z-10",
              "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center",
              "bg-white/10 hover:bg-white/20 transition-colors",
              "text-white"
            )}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Video */}
          <video
            ref={modalVideoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>
  );
}
