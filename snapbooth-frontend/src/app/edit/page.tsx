'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore, TemplateType, FilterType } from '../../store/useBoothStore';
import { TemplateClassic } from '../../components/templates/TemplateClassic';
import { TemplatePolaroid } from '../../components/templates/TemplatePolaroid';
import { TemplateEditorial } from '../../components/templates/TemplateEditorial';
import { renderImage } from '../../utils/renderImage';
import { Wand2, LayoutTemplate, Save, RotateCcw } from 'lucide-react';

export default function EditPage() {
  const router = useRouter();
  const { photos, template, filter, setTemplate, setFilter, setFinalImage, setFinalImageUrl, sessionId } = useBoothStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendTemplates, setBackendTemplates] = useState<any[]>([]);

  useEffect(() => {
    if (photos.length < 4 || !sessionId) {
      router.push('/capture');
    }

    // Fetch real templates from backend
    const fetchTemplates = async () => {
      try {
        const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/templates');
        const data = await res.json();
        if (data.success) {
          setBackendTemplates(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err);
      }
    };
    fetchTemplates();
  }, [photos, sessionId, router]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // 1. Render the image
      const dataUrl = await renderImage('print-template');
      if (!dataUrl) throw new Error('Failed to render image');
      
      setFinalImage(dataUrl);

      // 2. Upload final image to backend
      const blob = await fetch(dataUrl).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', blob, 'final_result.jpg');

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/final-image`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.message);
      
      const finalUrl = uploadData.data.finalImageUrl;
      setFinalImageUrl(finalUrl);

      // 3. Find a real template UUID from backend (matching by name or pick first)
      const templateNameMap: Record<string, string> = {
        'classic': 'Classic White',
        'polaroid': 'Rose Gold',
        'editorial': 'Midnight Black'
      };
      const targetName = templateNameMap[template] || 'Classic White';
      const realTemplate = backendTemplates.find(t => t.name === targetName) || backendTemplates[0];
      const templateId = realTemplate?.id;

      // 4. Complete session
      const completeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: templateId,
          finalImageUrl: finalUrl
        }),
      });
      const completeData = await completeRes.json();
      if (!completeData.success) throw new Error(completeData.message);

      router.push('/result');
    } catch (err: any) {
      alert(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const templates: { id: TemplateType; name: string }[] = [
    { id: 'classic', name: 'Classic Strip' },
    { id: 'polaroid', name: 'Polaroid Grid' },
    { id: 'editorial', name: 'The Daily Paper' },
  ];

  const filters: { id: FilterType; name: string }[] = [
    { id: 'normal', name: 'Normal' },
    { id: 'bw', name: 'B&W Classic' },
    { id: 'vintage', name: 'Vintage 90s' },
  ];

  if (photos.length < 4) return null;

  return (
    <main className="flex min-h-screen bg-blue-50/50">
      {/* Left side: Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="transform scale-[0.6] lg:scale-[0.8] origin-center shadow-2xl">
          {template === 'classic' && <TemplateClassic photos={photos} filter={filter} />}
          {template === 'polaroid' && <TemplatePolaroid photos={photos} filter={filter} />}
          {template === 'editorial' && <TemplateEditorial photos={photos} filter={filter} />}
        </div>
      </div>

      {/* Right side: Controls Panel */}
      <div className="w-[400px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] p-8 flex flex-col z-10">
        <div className="flex-1 overflow-y-auto space-y-10 pr-2">
          
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#1A1A1A]">
              <LayoutTemplate className="w-5 h-5 text-[#004795]" /> Select Layout
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    template === t.id 
                      ? 'border-[#004795] bg-[#004795]/10 text-[#004795] font-bold shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#1A1A1A]">
              <Wand2 className="w-5 h-5 text-[#004795]" /> Apply Filter
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    filter === f.id 
                      ? 'border-[#004795] bg-[#004795]/10 text-[#004795] font-bold shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full overflow-hidden bg-gray-200 ${f.id === 'normal' ? '' : `filter-${f.id}`}`}>
                    <img src={photos[0]} alt="filter preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-center">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 mt-auto space-y-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-5 bg-[#004795] text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-70"
          >
            {isGenerating ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Save className="w-6 h-6" /> Selesai & Simpan
              </>
            )}
          </button>
          
          <button
            onClick={() => router.push('/capture')}
            disabled={isGenerating}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" /> Retake Photos
          </button>
        </div>
      </div>
    </main>
  );
}
