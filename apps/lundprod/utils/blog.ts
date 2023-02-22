import { Category } from '@prisma/client';

export const getTitleFromFilename = (filename: string) => {
  const formattedRouteFile = filename
    .replace(/^\/blog\//, '')
    .replaceAll(
      /-[a-z0-9]/g,
      (val: string) =>
        ` ${val.substring(1)[0].toUpperCase()}${val.substring(2)}`
    );
  return formattedRouteFile[0].toUpperCase() + formattedRouteFile.substring(1);
};

export const CategoryWordingMapping: Record<Category, string> = {
  NEWS: 'News',
  TECH: 'Tech',
  VIDEOGAME: 'Jeu Vidéo',
  OTHER: 'Autre',
};
