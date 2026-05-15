import { useState, useEffect, useRef, useCallback } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsReady(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to access camera');
      setIsReady(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsReady(false);
    }
  }, []);

  const takePhoto = useCallback((): string | null => {
    if (!videoRef.current || !isReady) return null;
    
    const canvas = document.createElement('canvas');
    // Maintain aspect ratio 3:2 for each photo strip shot
    canvas.width = 1080;
    canvas.height = 720;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Flip horizontally for mirror effect (natural photobooth feel)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    // Draw the video frame to canvas
    // We'll center-crop if aspect ratios differ
    const vWidth = videoRef.current.videoWidth;
    const vHeight = videoRef.current.videoHeight;
    const vRatio = vWidth / vHeight;
    const cRatio = canvas.width / canvas.height;
    
    let sx = 0, sy = 0, sWidth = vWidth, sHeight = vHeight;
    
    if (vRatio > cRatio) {
      sWidth = vHeight * cRatio;
      sx = (vWidth - sWidth) / 2;
    } else {
      sHeight = vWidth / cRatio;
      sy = (vHeight - sHeight) / 2;
    }
    
    ctx.drawImage(videoRef.current, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }, [isReady]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { videoRef, startCamera, stopCamera, takePhoto, isReady, error };
}
