export const getParam = (
  param: string | string[] | undefined,
  defaultValue?: string,
) => {
  return Array.isArray(param) ? param[0] : param || defaultValue || '';
};
export const getNumberParam = (
  param: string | string[],
  defaultValue?: number,
) => {
  return (
    parseInt(Array.isArray(param) ? param[0] : param, 10) || defaultValue || 0
  );
};
