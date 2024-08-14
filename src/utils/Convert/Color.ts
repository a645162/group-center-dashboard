// Invert a hexadecimal color using the slice method
export const InvertHexColor = (hexColorString: string): string => {
  // Remove the '#' character if present
  let hexColor = hexColorString.replace(/^#/, '');

  // Expand shorthand hex color to full form if necessary
  if (hexColor.length === 3) {
    hexColor = hexColor
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // Convert hex color to RGB components using slice
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // Calculate the inverted color components
  const invertedR = 255 - r;
  const invertedG = 255 - g;
  const invertedB = 255 - b;

  // Convert the inverted RGB components back to a hex string
  const invertedHex = [
    invertedR.toString(16).padStart(2, '0'),
    invertedG.toString(16).padStart(2, '0'),
    invertedB.toString(16).padStart(2, '0'),
  ].join('');

  // Return the inverted color with the '#' prefix
  return `#${invertedHex}`;
};
