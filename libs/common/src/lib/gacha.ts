export type SellConfig = { basic: number; gold: number }
export type CardXPConfig = { basic: number; gold: number }
export type PriceConfig = { price: number }
export type ChancesConfig = { "1": number; "2": number; "3": number; "4": number; "5": number }


export const configSell = {"gold": 300, "basic": 100} as SellConfig;
export const configPrice = {"price": 1000} as PriceConfig;
export const configDropChances = {"1": 50, "2": 30, "3": 15, "4": 5} as ChancesConfig;
export const configCardXP = {"gold": 500, "basic": 100} as CardXPConfig;
export const configLevels = {"1": 0, "2": 1500, "3": 2500, "4": 5000, "5": 7500, "6": 10000, "7": 13300, "8": 16600, "9": 20000, "10": 23300, "11": 26600, "12": 30000, "13": 33300, "14": 36600, "15": 40000, "16": 43300, "17": 46600, "18": 50000, "19": 55000, "20": 60000, "21": 65000, "22": 70000, "23": 75000, "24": 80000, "25": 85000, "26": 90000, "27": 95000, "28": 100000, "29": 105000, "30": 110000, "31": 115000, "32": 120000, "33": 125000, "34": 130000, "35": 135000, "36": 140000, "37": 145000, "38": 150000, "39": 155000, "40": 160000} as Record<string, number>;
