import html2canvas from 'html2canvas';
import { useCallback } from 'react';

type Result = Promise<HTMLCanvasElement | null>;

export const useScreenshot = (selector: string): (() => Result) => {
  return useCallback(async (): Result => {
    console.log(selector);
    const element = document.querySelector(selector);

    if (!element) {
      return null;
    }

    const canvas = await html2canvas(element as HTMLElement, {
      ignoreElements: (element) =>
        (element as HTMLElement)?.dataset.screenshot === 'hidden',
      useCORS: true,
    });

    return canvas;
  }, [selector]);
};
