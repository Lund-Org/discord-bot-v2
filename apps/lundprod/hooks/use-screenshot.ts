import html2canvas from 'html2canvas';

type Result = Promise<HTMLImageElement | null>;

export function useScreenshot() {
  return async (element: HTMLElement | null): Result => {
    if (!element) {
      return null;
    }

    const canvas = await html2canvas(element as HTMLElement, {
      ignoreElements: (element) =>
        (element as HTMLElement)?.dataset.screenshot === 'hidden',
      useCORS: true,
    });

    const img = new Image();
    img.src = canvas.toDataURL();

    return img;
  };
}
