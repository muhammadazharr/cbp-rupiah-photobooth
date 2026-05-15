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
      <div className="h-24 flex items-center justify-center border-t-2 border-black/10 mt-2">
        <h2 className="text-3xl font-black tracking-widest text-[#1A1A1A]">SNAPBOOTH</h2>
      </div>
    </div>
  );
};
