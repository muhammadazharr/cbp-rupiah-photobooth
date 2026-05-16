import Link from 'next/link';
import { Camera } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl mix-blend-overlay pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl mix-blend-overlay pointer-events-none" />
      
      <div className="glass-panel p-12 rounded-3xl z-10 max-w-2xl w-full flex flex-col items-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-sm font-bold tracking-widest text-[#004795] uppercase">Bank Indonesia</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-[#1A1A1A]">
            CBP <span className="text-[#004795]">Rupiah</span>
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Cinta, Bangga, Paham Rupiah Photobooth
          </p>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto rounded-full" />
        </div>

        {/* Mock Carousel for photo previews */}
        <div className="flex gap-4 overflow-hidden py-4 w-full justify-center opacity-80">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-32 h-40 bg-white/70 rounded-xl border border-white shadow-md flex items-center justify-center ${i === 2 ? 'scale-110 -translate-y-2' : ''} transform transition-transform`}>
              <div className="w-24 h-32 bg-gray-200/50 rounded-md animate-pulse" />
            </div>
          ))}
        </div>

        <Link 
          href="/capture"
          className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold text-white bg-[#004795] rounded-full overflow-hidden shadow-xl shadow-blue-300/50 transition-all hover:scale-105 active:scale-95 no-select"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>
          <Camera className="w-8 h-8 mr-3" />
          AMBIL FOTO 📸
        </Link>
        
        <p className="text-sm text-gray-500 font-medium pt-4">
          Grup Teknologi dan Operasional (GTO)
        </p>
      </div>
    </main>
  );
}
