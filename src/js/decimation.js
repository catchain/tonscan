const getMedianYValue = (segment) => {
    const sortedValues = segment.sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedValues.length / 2);
    if (sortedValues.length % 2 === 0) {
      const median =
        (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
      return median;
    } else {
      return sortedValues[middleIndex];
    }
  };
  

export const decimateData = (data, n) => {
  const decimatedData = [];

  for (let i = 0; i < data.length - 1; i += n) {
    const segment = data.slice(i, i + n);
    const median = getMedianYValue(segment);
    decimatedData.push(median);
  }
  
  decimatedData.push(data.at(-1))

  return decimatedData;
};
