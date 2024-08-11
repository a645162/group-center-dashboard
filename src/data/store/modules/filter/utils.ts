export const MatchStringFilter = (
  originString: string,
  searchString: string,
  isFuzzyMatch: boolean = false,
) => {
  if (!searchString) {
    return true;
  }

  if (isFuzzyMatch) {
    return originString.includes(searchString);
  } else {
    return originString === searchString;
  }
};

export default { MatchStringFilter };
