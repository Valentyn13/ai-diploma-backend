function splitArrayToGroups(arr, groupSize = 30) {
  const result = new Array(Math.ceil(arr.length / groupSize));
  let j = 0;
  for (let i = 0; i < arr.length; i += groupSize) {
    result[j++] = arr.slice(i, i + groupSize);
  }
  return result;
}

module.exports = splitArrayToGroups;