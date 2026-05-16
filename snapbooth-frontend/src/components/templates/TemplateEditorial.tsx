import React from 'react';
import { FilterType } from '../../store/useBoothStore';

interface Props {
  photos: string[];
  filter: FilterType;
}

export const TemplateEditorial: React.FC<Props> = ({ photos, filter }) => {
  const filterClass = filter === 'normal' ? '' : `filter-${filter}`;

  return (
    <div id="print-template" className="w-[800px] h-[1100px] bg-[#fdfaf5] p-10 shadow-2xl flex flex-col border-x-[12px] border-y-[12px] border-[#004795]">
      <header className="border-b-4 border-[#004795] pb-4 mb-6 text-center">
        <h1 className="text-6xl font-serif font-black uppercase tracking-tighter text-[#1A1A1A]">CBP <span className="text-[#004795]">RUPIAH</span></h1>
        <p className="text-xl font-mono mt-2 border-y border-[#004795] py-1 text-[#004795]">Cinta • Bangga • Paham Rupiah • Bank Indonesia</p>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Main large photo */}
        <div className="col-span-8 flex flex-col gap-2">
          <div className="w-full h-[500px] overflow-hidden bg-black border-2 border-[#004795]">
            {photos[0] && <img src={photos[0]} className={`w-full h-full object-cover ${filterClass}`} crossOrigin="anonymous" />}
          </div>
          <h2 className="text-3xl font-black uppercase font-serif leading-none mt-2">Cinta Rupiah: Identitas Bangsa</h2>
          <p className="font-serif text-lg leading-tight mt-2 line-clamp-4">Rupiah merupakan satu-satunya alat pembayaran yang sah di Indonesia. Bangga menggunakan Rupiah berarti menjaga kedaulatan negara.</p>
        </div>

        {/* Sidebar smaller photos */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="w-full h-64 overflow-hidden bg-black border-2 border-[#004795]">
            {photos[1] && <img src={photos[1]} className={`w-full h-full object-cover ${filterClass}`} crossOrigin="anonymous" />}
          </div>
          <div className="border-t-2 border-b-2 border-[#004795] py-2">
            <h3 className="text-xl font-black uppercase font-serif text-center text-[#004795]">Bangga Rupiah</h3>
          </div>
          <div className="w-full h-64 overflow-hidden bg-black border-2 border-[#004795]">
            {photos[2] && <img src={photos[2]} className={`w-full h-full object-cover ${filterClass}`} crossOrigin="anonymous" />}
          </div>
        </div>
      </div>
      
      {/* Bottom photo spanning full width */}
      <div className="w-full h-64 mt-6 overflow-hidden bg-black border-2 border-[#004795]">
        {photos[3] && <img src={photos[3]} className={`w-full h-full object-cover object-top ${filterClass}`} crossOrigin="anonymous" />}
      </div>
    </div>
  );
};
