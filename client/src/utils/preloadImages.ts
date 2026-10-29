export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = async () => {
      try {
        await img.decode();
      } catch {
        // Image is still usable even if decode() fails.
      }

      resolve();
    };

    img.onerror = () => resolve();

    img.src = src;
  });
};

export const preloadImages = async (sources: string[]): Promise<void> => {
  await Promise.all(sources.map(preloadImage));
};
