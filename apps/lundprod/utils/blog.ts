import { Category } from '@prisma/client';

export const getTitleFromFilename = (filename: string) => {
  const formattedRouteFile = filename
    .replace(/^\/blog\//, '')
    .replace(
      /-[a-z0-9]/,
      (val: string) =>
        ` ${val.substring(1)[0].toUpperCase()}${val.substring(2)}`
    );
  return formattedRouteFile[0].toUpperCase() + formattedRouteFile.substring(1);
};

export const CategoryWordingMapping: Record<Category, string> = {
  NEWS: 'News',
  TECH: 'Tech',
  VIDEO: 'Vidéo',
  OTHER: 'Autre',
};
