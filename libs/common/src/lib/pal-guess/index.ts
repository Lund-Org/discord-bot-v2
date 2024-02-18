import paldex from './data.json';

export function getRandomPal() {
  const randomId = Math.floor(Math.random() * paldex.length);

  return paldex[randomId];
}

export function isRightPal(suggestion: string, refId: number) {
  const returnValue = {
    notFound: false,
    wrong: false,
    valid: false,
  };
  const handle = paldex.find(
    (pal) => pal.name.toLowerCase() === suggestion.trim().toLowerCase(),
  );

  if (!handle) {
    return { ...returnValue, notFound: true };
  } else if (handle.id !== refId) {
    return { ...returnValue, wrong: true };
  } else {
    return { ...returnValue, valid: true };
  }
}
