export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type ValueOf<T> = T[keyof T];

export type ChancesConfig = {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
};
export type SellConfig = { basic: number; gold: number };
export type PriceConfig = { price: number };
export type CardXPConfig = { gold: number; basic: number };
