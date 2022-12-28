export const getParam = (param: string | string[], defaultValue?: string) => {
  return Array.isArray(param) ? param[0] : param || defaultValue || '';
};
