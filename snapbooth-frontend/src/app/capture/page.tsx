'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCamera } from '../../hooks/useCamera';
import { useBoothStore } from '../../store/useBoothStore';

export default function CapturePage() {
  const router = useRouter();
  const { videoRef, startCamera, stopCamera, takePhoto, isReady, error } = useCamera();
  const { photos, addPhoto, resetPhotos } = useBoothStore();
  
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  // Auto start camera on mount
  useEffect(() => {
    resetPhotos();
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera, resetPhotos]);

  // Navigate to edit when 4 photos are taken
  useEffect(() => {
    if (photos.length === 4) {
      setTimeout(() => {
        router.push('/edit');
      }, 1000);
    }
  }, [photos.length, router]);

  const startCaptureSequence = () => {
    if (countdown !== null || photos.length >= 4) return;
    
    let count = 3;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        
        // Take photo effect
        setFlash(true);
        // Play shutter sound if added
        // new Audio('/sounds/shutter.mp3').play().catch(e => console.log(e));
        
        setTimeout(() => setFlash(false), 150);
        
        const photoUrl = takePhoto();
        if (photoUrl) {
          addPhoto(photoUrl);
        }
      }
    }, 1000);
  };

  return (
    <main className="flex min-h-screen bg-black text-white relative flex-col">
      {/* Main Camera View */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="text-red-400 p-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Camera Error</h2>
            <p>{error}</p>
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="absolute min-w-full min-h-full object-cover -scale-x-100" 
          />
        )}
        
        {/* Safe Area Grid Overlay (Rule of Thirds) */}
        <div className="absolute inset-0 pointer-events-none border-x border-y border-white/20 grid grid-cols-3 grid-rows-3 z-10 w-[80%] h-[80%] max-w-4xl max-h-[80vh] m-auto">
          <div className="border-r border-b border-white/20"></div>
          <div className="border-r border-b border-white/20"></div>
          <div className="border-b border-white/20"></div>
          <div className="border-r border-b border-white/20"></div>
          <div className="border-r border-b border-white/20"></div>
          <div className="border-b border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div></div>
        </div>

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/30">
            <span className="text-9xl font-black text-white drop-shadow-2xl animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {/* Flash Effect */}
        {flash && (
          <div className="absolute inset-0 bg-white z-50 transition-opacity duration-100" />
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="h-40 bg-black/80 backdrop-blur-md border-t border-gray-800 p-6 flex items-center justify-between z-20">
        
        {/* Photo Indicators */}
        <div className="flex gap-3">
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index} 
              className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-all ${index < photos.length ? 'border-[#F472B6]' : 'border-gray-700 bg-gray-900'}`}
            >
              {photos[index] && (
                <img src={photos[index]} alt={`shot ${index + 1}`} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>

        {/* Capture Button */}
        {photos.length < 4 ? (
          <button
            onClick={startCaptureSequence}
            disabled={!isReady || countdown !== null}
            className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-white hover:bg-white/10 transition disabled:opacity-50 no-select"
          >
            <div className={`w-20 h-20 bg-white rounded-full transition-all ${countdown !== null ? 'scale-90 bg-red-500' : 'hover:scale-95'}`} />
          </button>
        ) : (
          <div className="text-xl font-bold text-[#F472B6] animate-pulse">
            Processing...
          </div>
        )}

        {/* Spacer to balance flex layout */}
        <div className="w-[18rem]" /> 
      </div>
    </main>
  );
}
