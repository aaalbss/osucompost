"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  autoPlay = false,
  loop = false,
  muted = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle play/pause
  const handlePlayPause = () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err: Error) => {
              console.error("Error al reproducir el video:", err);
              setIsPlaying(false);
            });
        }
      }
    } catch (error) {
      console.error("Error en handlePlayPause:", error);
    }
  };

  // Handle video time update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 0;
    const progressPercentage = (currentTime / duration) * 100;

    setCurrentTime(currentTime);
    setProgress(progressPercentage);
  };

  // Handle seeking by clicking the progress bar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    // Prevent this from triggering play/pause
    e.stopPropagation();

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * videoRef.current.duration;

    videoRef.current.currentTime = newTime;
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;

    const newMuteState = !isMuted;
    videoRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Format time to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  // Auto-hide controls after inactivity
  const showControlsTemporarily = () => {
    setShowControls(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("ended", handleEnded);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("ended", handleEnded);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div
      ref={playerRef}
      className="w-full max-w-3xl mx-auto bg-black rounded-lg overflow-hidden border-2 border-green-800 shadow-2xl relative"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video */}
      <div className="relative bg-black">
        <video
          ref={videoRef}
          className="w-full h-full"
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          playsInline
          poster={posterUrl}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
        />

        {/* Big Play Button (center) - visible when video is not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={handlePlayPause}
              className="w-20 h-20 bg-green-800 bg-opacity-80 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
              aria-label="Play video"
            >
              <Play size={40} />
            </button>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black to-transparent bottom-0 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Bottom controls bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress bar */}
            <div
              className="w-full h-1 bg-gray-600 rounded-full mb-2 cursor-pointer group"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-green-800 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute w-3 h-3 bg-white rounded-full right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100" />
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between">
              {/* Left side controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-green-400 transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                {/* Botón de retroceso más sutil */}
                <button
                  onClick={() => skip(-10)}
                  className="text-gray-300 hover:text-white p-1 transition-colors duration-150 flex items-center justify-center"
                  aria-label="Retroceder 10 segundos"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 16C12.7614 16 15 13.7614 15 11C15 8.23858 12.7614 6 10 6C7.23858 6 5 8.23858 5 11C5 13.7614 7.23858 16 10 16Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 8.5V11L12 12.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 11C4 7 7 4 11 4C15 4 18 7 18 11"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="0.5 2"
                    />
                    <path
                      d="M7 13L5 11L3.5 13"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ml-0.5 text-xs font-medium opacity-80">
                    10
                  </span>
                </button>

                {/* Botón de avance más sutil */}
                <button
                  onClick={() => skip(10)}
                  className="text-gray-300 hover:text-white p-1 transition-colors duration-150 flex items-center justify-center"
                  aria-label="Avanzar 10 segundos"
                >
                  <span className="mr-0.5 text-xs font-medium opacity-80">
                    10
                  </span>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 16C11.2386 16 9 13.7614 9 11C9 8.23858 11.2386 6 14 6C16.7614 6 19 8.23858 19 11C19 13.7614 16.7614 16 14 16Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 8.5V11L12 12.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 11C20 7 17 4 13 4C9 4 6 7 6 11"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="0.5 2"
                    />
                    <path
                      d="M17 13L19 11L20.5 13"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white hover:text-green-400 transition-colors"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <div className="w-20">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-green-800 cursor-pointer"
                  />
                </div>

                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Right side controls */}
              <div>
                <button
                  onClick={toggleFullscreen}
                  className="text-gray-300 hover:text-white transition-colors rounded p-1"
                >
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;