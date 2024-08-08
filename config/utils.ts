export const getEnvBool = (key: string): boolean => {
  const value = process.env[key];

  if (value === undefined) {
    // Key is undefined
    return false;
  }

  return value.toString().toLowerCase().trim() === 'true';
};
