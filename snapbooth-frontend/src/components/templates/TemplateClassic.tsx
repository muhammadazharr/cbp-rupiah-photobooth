import React from 'react';
import { FilterType } from '../../store/useBoothStore';

interface Props {
  photos: string[];
  filter: FilterType;
}

export const TemplateClassic: React.FC<Props> = ({ photos, filter }) => {
  const filterClass = filter === 'normal' ? '' : `filter-${filter}`;

  return (
    <div id="print-template" className="w-[400px] h-[1200px] bg-white p-6 flex flex-col gap-6 shadow-2xl">
      {/* 4 Strip layout */}
      {photos.map((photo, i) => (
        <div key={i} className="flex-1 overflow-hidden bg-gray-200">
          <img 
            src={photo} 
            alt={`shot ${i}`} 
            className={`w-full h-full object-cover ${filterClass}`}
            crossOrigin="anonymous" 
          />
        </div>
      ))}
      {/* Footer / Logo area */}
      <div className="h-24 flex flex-col items-center justify-center border-t-2 border-blue-500/20 mt-2">
        <span className="text-xs font-bold text-[#004795] tracking-widest uppercase">Bank Indonesia</span>
        <h2 className="text-2xl font-black tracking-tighter text-[#1A1A1A]">CBP <span className="text-[#004795]">RUPIAH</span></h2>
      </div>
    </div>
  );
};
