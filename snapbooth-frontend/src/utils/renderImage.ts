import html2canvas from 'html2canvas';

export const renderImage = async (elementId: string): Promise<string | null> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return null;
  }

  try {
    // Wait for images to load just in case
    const images = Array.from(element.getElementsByTagName('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    const canvas = await html2canvas(element, {
      scale: 3, // High quality for printing (300dpi approx)
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
    });
    
    // Returns base64 jpeg
    return canvas.toDataURL('image/jpeg', 0.95);
  } catch (error) {
    console.error('Error rendering image:', error);
    return null;
  }
};
