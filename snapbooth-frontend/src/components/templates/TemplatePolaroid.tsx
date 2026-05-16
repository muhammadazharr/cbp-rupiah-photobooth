import React from 'react';
import { FilterType } from '../../store/useBoothStore';

interface Props {
  photos: string[];
  filter: FilterType;
}

export const TemplatePolaroid: React.FC<Props> = ({ photos, filter }) => {
  const filterClass = filter === 'normal' ? '' : `filter-${filter}`;

  return (
    <div id="print-template" className="w-[800px] h-[1000px] bg-[#f8f8f8] p-8 shadow-2xl flex flex-col">
      <div className="grid grid-cols-2 gap-8 flex-1">
        {photos.map((photo, i) => (
          <div key={i} className="bg-white p-4 pb-16 shadow-md border border-gray-100 flex flex-col">
            <div className="flex-1 overflow-hidden bg-black">
              <img 
                src={photo} 
                alt={`shot ${i}`} 
                className={`w-full h-full object-cover ${filterClass}`}
                crossOrigin="anonymous" 
              />
            </div>
            {/* Polaroid caption area */}
          </div>
        ))}
      </div>
      <div className="h-32 flex flex-col items-center justify-center mt-8 text-[#1A1A1A]">
        <span className="text-sm font-bold text-[#004795] tracking-[0.3em] uppercase mb-1">Bank Indonesia</span>
        <h2 className="text-4xl font-black tracking-tighter">CBP <span className="text-[#004795]">RUPIAH</span></h2>
      </div>
    </div>
  );
};
