function convertParamToArray(data: string): number[] {
    const regex = /\d+/g;
    const matches = data.match(regex);
    if (!matches) {
      throw new Error("Input string contains no numbers");
    }
    return matches.map(Number);
  }

  const data: string = "[1 2 3]";
  const array: number[] = convertParamToArray(data);
  console.log(array);
  // Output: [1, 2, 3]
  