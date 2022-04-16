export default (array: number[], value: number): number => {
  let left = 0;
  let right = array.length - 1;
  let mid;

  while (left <= right) {
    mid = Math.floor((left + right) / 2);

    if (value > array[mid]) {
      left = mid + 1;
    } else if (value < array[mid]) {
      right = mid - 1;
    }
  }

  return left;
}
