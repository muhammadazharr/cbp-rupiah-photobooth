import html2canvas from 'html2canvas';

export const renderImage = async (elementId: string): Promise<string | null> => {
  const element = document.getElementById(elementId);
  if (!element) return null;

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High quality for printing
      useCORS: true,
      backgroundColor: null, // Keep transparent or set to specific color if needed
      logging: false,
    });
    
    // Returns base64 jpeg
    return canvas.toDataURL('image/jpeg', 0.95);
  } catch (error) {
    console.error('Error rendering image:', error);
    return null;
  }
};
