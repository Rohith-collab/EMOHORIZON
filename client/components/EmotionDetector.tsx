import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface EmotionDetectorProps {
  onEmotionDetected?: (emotion: string) => void;
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({
  onEmotionDetected,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotion, setEmotion] = useState("Detecting...");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const detectionLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Load the models once
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL =
          "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models:", err);
        setError(
          "Failed to load emotion detection models. Please refresh the page."
        );
      }
    };
    loadModels();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError(
        "Camera access denied. Please allow camera permissions and try again."
      );
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraOn(false);
      if (detectionLoopRef.current) {
        clearTimeout(detectionLoopRef.current);
      }
    }
  };

  // Detect emotions in loop
  const detectEmotions = async () => {
    if (!videoRef.current || !modelsLoaded) return;

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        const emotionEntries = Object.entries(detections.expressions);
        const detectedEmotion = emotionEntries.reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];

        const formattedEmotion =
          detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1);
        setEmotion(formattedEmotion);
        onEmotionDetected?.(formattedEmotion);
      } else {
        setEmotion("No face detected");
      }
    } catch (err) {
      console.error("Error detecting emotion:", err);
    }

    detectionLoopRef.current = setTimeout(detectEmotions, 500);
  };

  useEffect(() => {
    if (isCameraOn && modelsLoaded) {
      const handleVideoPlay = () => {
        detectEmotions();
      };
      const video = videoRef.current;
      if (video) {
        video.addEventListener("play", handleVideoPlay);
        return () => {
          video.removeEventListener("play", handleVideoPlay);
          if (detectionLoopRef.current) {
            clearTimeout(detectionLoopRef.current);
          }
        };
      }
    }
  }, [isCameraOn, modelsLoaded]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm max-w-sm">
          {error}
        </div>
      )}

      {!modelsLoaded ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading emotion detection...</p>
        </div>
      ) : !isCameraOn ? (
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-16 h-16 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <button
            onClick={startCamera}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Enable Camera
          </button>
          <p className="text-xs text-gray-500 text-center max-w-xs">
            Click to start emotion detection. Your video stream is processed locally and not stored.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full h-full">
          <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              muted
              width={320}
              height={240}
              className="rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>

          <div className="flex flex-col items-center gap-2 bg-white rounded-lg p-4 shadow-md w-full max-w-xs">
            <p className="text-sm text-gray-600 font-medium">
              Current Emotion
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {emotion}
            </p>
          </div>

          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors duration-200"
          >
            Stop Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;
