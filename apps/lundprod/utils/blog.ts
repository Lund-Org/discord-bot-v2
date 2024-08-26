import { Category } from '@prisma/client';
import { TFunction } from 'i18next';

export const getTitleFromFilename = (filename: string) => {
  const formattedRouteFile = filename
    .replace(/^\/blog\//, '')
    .replaceAll(
      /-[a-z0-9]/g,
      (val: string) =>
        ` ${val.substring(1)[0].toUpperCase()}${val.substring(2)}`,
    );
  return formattedRouteFile[0].toUpperCase() + formattedRouteFile.substring(1);
};

export const CategoryKeys: Category[] = [
  Category.NEWS,
  Category.VIDEOGAME,
  Category.TECH,
  Category.OTHER,
];

export const getCategoryName = (tFn: TFunction, name: Category) => {
  switch (name) {
    case Category.NEWS:
      return tFn('blog.categoryName.news');
    case Category.TECH:
      return tFn('blog.categoryName.tech');
    case Category.VIDEOGAME:
      return tFn('blog.categoryName.videogame');
    case Category.OTHER:
    default:
      return tFn('blog.categoryName.other');
  }
};
