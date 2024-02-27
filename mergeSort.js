function mergeSort(array) {
  if (array.length <= 1) return array;

  const middlePoint = Math.floor(array.length / 2);
  const leftArray = mergeSort(array.slice(0, middlePoint));
  const rightArray = mergeSort(array.slice(middlePoint));

  return merge(leftArray, rightArray);
}

function merge(leftArray, rightArray) {
  const merged = [];
  while (leftArray.length > 0 && rightArray.length > 0) {
    if (leftArray[0] < rightArray[0]) merged.push(leftArray.shift());
    else merged.push(rightArray.shift());
  }

  return merged.concat(leftArray, rightArray);
}

export default mergeSort;
