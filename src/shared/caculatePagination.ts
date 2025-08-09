export const calculatePagination = (page: number, limit: number): number => {
  const skip = (page - 1) * limit;
  return skip;
};
