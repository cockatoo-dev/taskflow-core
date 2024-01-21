export const taskSortNum = (isComplete: boolean, isReady: boolean) => {
  if (isComplete) {
    return 0
  } else if (isReady) {
    return 2
  } else {
    return 1
  }
}