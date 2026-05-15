import { create } from 'zustand';

export type FilterType = 'normal' | 'bw' | 'vintage';
export type TemplateType = 'classic' | 'polaroid' | 'editorial';

interface BoothState {
  photos: string[];
  template: TemplateType;
  filter: FilterType;
  finalImage: string | null;
  addPhoto: (photoDataUrl: string) => void;
  resetPhotos: () => void;
  setTemplate: (template: TemplateType) => void;
  setFilter: (filter: FilterType) => void;
  setFinalImage: (imageUrl: string) => void;
  resetAll: () => void;
}

export const useBoothStore = create<BoothState>((set) => ({
  photos: [],
  template: 'classic',
  filter: 'normal',
  finalImage: null,
  
  addPhoto: (photoDataUrl) => set((state) => ({ 
    photos: [...state.photos, photoDataUrl].slice(0, 4) 
  })),
  
  resetPhotos: () => set({ photos: [] }),
  setTemplate: (template) => set({ template }),
  setFilter: (filter) => set({ filter }),
  setFinalImage: (finalImage) => set({ finalImage }),
  
  resetAll: () => set({ 
    photos: [], 
    template: 'classic', 
    filter: 'normal', 
    finalImage: null 
  }),
}));
