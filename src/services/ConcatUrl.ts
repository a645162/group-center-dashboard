export const ConcatUrl = (baseUrl: string, apiUrl: string) => {
  let finalUrl = baseUrl.trim() + '/' + apiUrl.trim();

  while (finalUrl.includes('//')) {
    finalUrl = finalUrl.replace('//', '/');
  }
  return finalUrl;
};

export const GetApiUrl = ConcatUrl;

export default ConcatUrl;
