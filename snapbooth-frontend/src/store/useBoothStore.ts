import { create } from 'zustand';

export type FilterType = 'normal' | 'bw' | 'vintage';
export type TemplateType = 'classic' | 'polaroid' | 'editorial';

interface BoothState {
  sessionId: string | null;
  photos: string[];
  template: TemplateType;
  filter: FilterType;
  finalImage: string | null; // Data URL for preview
  finalImageUrl: string | null; // Backend URL for sharing/QR
  setSessionId: (id: string) => void;
  addPhoto: (photoDataUrl: string) => void;
  resetPhotos: () => void;
  setTemplate: (template: TemplateType) => void;
  setFilter: (filter: FilterType) => void;
  setFinalImage: (imageUrl: string) => void;
  setFinalImageUrl: (url: string) => void;
  resetAll: () => void;
}

export const useBoothStore = create<BoothState>((set) => ({
  sessionId: null,
  photos: [],
  template: 'classic',
  filter: 'normal',
  finalImage: null,
  finalImageUrl: null,
  
  setSessionId: (sessionId) => set({ sessionId }),
  
  addPhoto: (photoDataUrl) => set((state) => ({ 
    photos: [...state.photos, photoDataUrl].slice(0, 4) 
  })),
  
  resetPhotos: () => set({ photos: [] }),
  setTemplate: (template) => set({ template }),
  setFilter: (filter) => set({ filter }),
  setFinalImage: (finalImage) => set({ finalImage }),
  setFinalImageUrl: (finalImageUrl) => set({ finalImageUrl }),
  
  resetAll: () => set({ 
    sessionId: null,
    photos: [], 
    template: 'classic', 
    filter: 'normal', 
    finalImage: null,
    finalImageUrl: null
  }),
}));
