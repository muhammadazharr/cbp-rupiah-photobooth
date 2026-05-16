'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '../../store/useBoothStore';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, MessageCircle, Home, CheckCircle2 } from 'lucide-react';

export default function ResultPage() {
  const router = useRouter();
  const { finalImage, resetAll } = useBoothStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!finalImage) {
      router.push('/');
    }
  }, [finalImage, router]);

  const handlePrint = () => {
    // In a real app, this would call the /api/print backend endpoint
    // For web frontend, we can trigger browser print or show a success message
    window.print();
  };

  const handleSendWA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setIsSending(true);
    // Simulate API call to backend /api/whatsapp/send
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setPhoneNumber('');
      
      // Reset sent status after 3 seconds
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  const handleDone = () => {
    resetAll();
    router.push('/');
  };

  if (!finalImage) return null;

  return (
    <main className="flex min-h-screen bg-blue-50/50 p-8 pt-12 items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: Result Preview */}
        <div className="flex flex-col items-center justify-center bg-white/40 p-8 rounded-3xl backdrop-blur-sm border border-white/50 shadow-xl">
          <div className="w-full max-w-md bg-white p-4 shadow-2xl rounded-sm transform -rotate-2">
            <img src={finalImage} alt="Final result" className="w-full h-auto" />
          </div>
        </div>

        {/* Right Side: Actions Panel */}
        <div className="flex flex-col justify-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-[#1A1A1A]">Keren Sekali! ✨</h1>
            <p className="text-xl text-gray-700">Dapatkan salinan digital dan cetak versi fisiknya.</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl space-y-8">
            {/* Scan QR */}
            <div className="flex items-center gap-6">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <QRCodeSVG value="https://snapbooth.app/gallery/12345" size={120} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Pindai untuk Unduh</h3>
                <p className="text-gray-600">Gunakan kamera smartphone Anda untuk memindai kode QR dan mengunduh gambar resolusi tinggi.</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200/50"></div>

            {/* Send to WA */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#1A1A1A]">Kirim ke WhatsApp</h3>
              {sent ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-medium">Gambar berhasil dikirim!</span>
                </div>
              ) : (
                <form onSubmit={handleSendWA} className="flex gap-3">
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#004795] bg-white text-lg"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !phoneNumber}
                    className="px-8 py-4 bg-[#25D366] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#128C7E] active:scale-95 transition-all disabled:opacity-70 shadow-lg shadow-green-200"
                  >
                    {isSending ? 'Mengirim...' : <><MessageCircle className="w-6 h-6" /> Kirim</>}
                  </button>
                </form>
              )}
            </div>

            <div className="w-full h-px bg-gray-200/50"></div>

            {/* Print & Done */}
            <div className="flex gap-4">
              <button
                onClick={handlePrint}
                className="flex-1 py-5 bg-[#004795] text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-2 hover:bg-blue-800 active:scale-95 transition-all shadow-xl shadow-blue-200"
              >
                <Printer className="w-6 h-6" /> Cetak Foto
              </button>
              
              <button
                onClick={handleDone}
                className="flex-1 py-5 bg-white text-[#1A1A1A] border-2 border-gray-200 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Home className="w-6 h-6" /> Selesai
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </main>
  );
}
